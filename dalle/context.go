package dalle

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"text/template"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/logger"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/image"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/model"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/prompt"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/utils"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// Context holds templates, series, dbs, and cache for prompt generation.
type Context struct {
	Series         Series
	Databases      map[string][]string
	DalleCache     map[string]*model.DalleDress
	CacheMutex     sync.Mutex
	promptTemplate *template.Template
	dataTemplate   *template.Template
	titleTemplate  *template.Template
	terseTemplate  *template.Template
	authorTemplate *template.Template
}

func NewContext() *Context {
	cm := storage.GetCacheManager()

	// Load database cache only
	if err := cm.LoadOrBuild(); err != nil {
		logger.Error("Failed to initialize caches:", err)
	}

	ctx := Context{
		promptTemplate: prompt.PromptTemplate,
		dataTemplate:   prompt.DataTemplate,
		titleTemplate:  prompt.TitleTemplate,
		terseTemplate:  prompt.TerseTemplate,
		authorTemplate: prompt.AuthorTemplate,
		Series:         Series{},
		Databases:      make(map[string][]string),
		DalleCache:     make(map[string]*model.DalleDress),
	}

	if err := ctx.ReloadDatabases("empty"); err != nil {
		logger.Error("error reloading databases:", err)
	}
	return &ctx
}

var saveMutex sync.Mutex

// reportOn logs and saves generated prompt data for a given address and location.
func (ctx *Context) reportOn(dd *model.DalleDress, addr, loc, ft, value string) {
	_ = addr
	path := filepath.Join(storage.OutputDir(), strings.ToLower(loc))

	saveMutex.Lock()
	defer saveMutex.Unlock()
	_ = file.EstablishFolder(path)
	_ = file.StringToAsciiFile(filepath.Join(path, dd.FileName+"."+ft), value)
}

// MakeDalleDress builds or retrieves a DalleDress for the given address using the context's templates, series, dbs, and cache.
func (ctx *Context) MakeDalleDress(addressIn string) (*model.DalleDress, error) {
	ctx.CacheMutex.Lock()
	defer ctx.CacheMutex.Unlock()
	if ctx.DalleCache[addressIn] != nil {
		return ctx.DalleCache[addressIn], nil
	}

	address := addressIn
	// ENS resolution should be handled outside, but you can add it here if needed

	parts := strings.Split(address, ",")
	seed := parts[0] + utils.Reverse(parts[0])
	if len(seed) < 66 {
		return nil, fmt.Errorf("seed length is less than 66")
	}
	if strings.HasPrefix(seed, "0x") {
		seed = seed[2:66]
	}

	fn := utils.ValidFilename(address)
	if ctx.DalleCache[fn] != nil {
		return ctx.DalleCache[fn], nil
	}

	dd := model.DalleDress{
		Original:        addressIn,
		FileName:        fn,
		Seed:            seed,
		AttribMap:       make(map[string]prompt.Attribute),
		SeedChunks:      []string{},
		SelectedTokens:  []string{},
		SelectedRecords: []string{},
		Attribs:         []prompt.Attribute{},
		Series:          ctx.Series.Suffix,
	}

	// Generate attributes from the seed. We cap the number of attributes to the number of
	// configured databases (DatabaseNames) and carefully guard slice bounds so we never
	// index past the seed or database lists. The original logic could overrun both the
	// seed slicing (i+6) and the database name list when the seed was long enough to
	// create more than len(DatabaseNames) attributes.
	maxAttribs := len(prompt.DatabaseNames)
	cnt := 0
	for i := 0; i+6 <= len(dd.Seed) && cnt < maxAttribs; i += 8 {
		attr := prompt.NewAttribute(ctx.Databases, cnt, dd.Seed[i:i+6])
		dd.Attribs = append(dd.Attribs, attr)
		dd.AttribMap[attr.Name] = attr
		dd.SeedChunks = append(dd.SeedChunks, attr.Value)
		dd.SelectedTokens = append(dd.SelectedTokens, attr.Name)
		dd.SelectedRecords = append(dd.SelectedRecords, attr.Value)
		cnt++
		if cnt < maxAttribs && i+4+6 <= len(dd.Seed) {
			attr = prompt.NewAttribute(ctx.Databases, cnt, dd.Seed[i+4:i+4+6])
			dd.Attribs = append(dd.Attribs, attr)
			dd.AttribMap[attr.Name] = attr
			dd.SeedChunks = append(dd.SeedChunks, attr.Value)
			dd.SelectedTokens = append(dd.SelectedTokens, attr.Name)
			dd.SelectedRecords = append(dd.SelectedRecords, attr.Value)
			cnt++
		}
	}

	suff := ctx.Series.Suffix
	dd.DataPrompt, _ = dd.ExecuteTemplate(ctx.dataTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "data"), "txt", dd.DataPrompt)
	dd.TitlePrompt, _ = dd.ExecuteTemplate(ctx.titleTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "title"), "txt", dd.TitlePrompt)
	dd.TersePrompt, _ = dd.ExecuteTemplate(ctx.terseTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "terse"), "txt", dd.TersePrompt)
	dd.Prompt, _ = dd.ExecuteTemplate(ctx.promptTemplate, nil)
	ctx.reportOn(&dd, addressIn, filepath.Join(suff, "prompt"), "txt", dd.Prompt)
	fnPath := filepath.Join(storage.OutputDir(), ctx.Series.Suffix, "enhanced", dd.FileName+".txt")
	if !file.FileExists(fnPath) {
		fnPath = filepath.Join(storage.OutputDir(), ctx.Series.Suffix, "enhanced", dd.FileName+".txt")
	}
	dd.EnhancedPrompt = ""
	if file.FileExists(fnPath) {
		dd.EnhancedPrompt = file.AsciiFileToString(fnPath)
	}

	ctx.DalleCache[dd.FileName] = &dd
	ctx.DalleCache[addressIn] = &dd
	if dd.Series != ctx.Series.Suffix {
		logger.Error("MakeDalleDress:seriesMismatch", addressIn, "series", dd.Series, "loaded", ctx.Series.Suffix)
	}
	return &dd, nil
}

// GetPrompt returns the generated prompt for the given address.
func (ctx *Context) GetPrompt(addr string) string {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error()
	} else {
		return dd.Prompt
	}
}

// GetEnhanced returns the enhanced prompt for the given address.
func (ctx *Context) GetEnhanced(addr string) string {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error()
	} else {
		return dd.EnhancedPrompt
	}
}

// Save generates and saves prompt data for the given address.
func (ctx *Context) Save(addr string) bool {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return false
	} else {
		ctx.reportOn(dd, addr, filepath.Join(ctx.Series.Suffix, "selector"), "json", dd.String())
		return true
	}
}

// GenerateEnhanced generates an enhanced prompt for the given address.
func (ctx *Context) GenerateEnhanced(addr string) (string, error) {
	if dd, err := ctx.MakeDalleDress(addr); err != nil {
		return err.Error(), err
	} else {
		authorType, _ := dd.ExecuteTemplate(ctx.authorTemplate, nil)
		if dd.EnhancedPrompt, err = prompt.EnhancePrompt(ctx.GetPrompt(addr), authorType); err != nil {
			logger.Error("EnhancePrompt error:", err)
			return "", err
		}
		msg := " DO NOT PUT TEXT IN THE IMAGE. "
		dd.EnhancedPrompt = msg + dd.EnhancedPrompt + msg
		return dd.EnhancedPrompt, nil
	}
}

// GenerateImage generates an image using the DALL-E API.
func (ctx *Context) GenerateImage(address string) (string, error) {
	return ctx.GenerateImageWithBaseURL(address, "")
}

// GenerateImageWithBaseURL generates an image using the DALL-E API with a specific base URL.
func (ctx *Context) GenerateImageWithBaseURL(address, baseURL string) (string, error) {
	ctx.CacheMutex.Lock()
	dd, ok := ctx.DalleCache[address]
	ctx.CacheMutex.Unlock()
	if !ok {
		return "", fmt.Errorf("DalleDress not found in cache for address: %s", address)
	}

	// If the enhanced prompt is empty, generate it.
	if dd.EnhancedPrompt == "" {
		if _, err := ctx.GenerateEnhanced(address); err != nil {
			return "", fmt.Errorf("error generating enhanced prompt: %w", err)
		}
	}

	suff := ctx.Series.Suffix
	ctx.reportOn(dd, address, filepath.Join(suff, "enhanced"), "txt", dd.EnhancedPrompt)
	_ = ctx.Save(address)
	imageData := image.ImageData{
		EnhancedPrompt: dd.EnhancedPrompt,
		TersePrompt:    dd.TersePrompt,
		TitlePrompt:    dd.TitlePrompt,
		SeriesName:     ctx.Series.Suffix,
		Filename:       dd.FileName,
		Series:         ctx.Series.Suffix,
		Address:        address,
	}

	generatedPath := filepath.Join(storage.OutputDir(), ctx.Series.Suffix, "generated")
	if err := image.RequestImage(generatedPath, &imageData, baseURL); err != nil {
		return "", err
	}

	return generatedPath, nil
}

// ReloadDatabases reloads databases applying filters from the specified series suffix.
// Now uses binary cache for improved performance while maintaining immutability.
func (ctx *Context) ReloadDatabases(filter string) error {
	ctx.Series = Series{}
	ctx.Databases = make(map[string][]string)

	if s, err := ctx.loadSeries(filter); err != nil {
		return err
	} else {
		ctx.Series = s
	}
	logger.InfoG("db.series.reload", "series", ctx.Series.Suffix)

	// Ensure cache manager is loaded
	cm := storage.GetCacheManager()
	if err := cm.LoadOrBuild(); err != nil {
		logger.Error("Failed to load cache manager, using fallback:", err)
	}

	for _, db := range prompt.DatabaseNames {
		if ctx.Databases[db] != nil {
			continue
		}

		// Try to get database from cache first
		dbIndex, err := cm.GetDatabase(db)
		if err != nil {
			logger.Error("Failed to get database from cache, using fallback:", err)
			// Fall back to original CSV reading
			if fallbackErr := ctx.loadDatabaseFallback(db, filter); fallbackErr != nil {
				return fallbackErr
			}
			continue
		}

		// Convert database index to string slice format (for compatibility)
		lines := make([]string, 0, len(dbIndex.Records))
		for _, record := range dbIndex.Records {
			// Reconstruct CSV line from record values
			line := strings.Join(record.Values, ",")
			lines = append(lines, line)
		}

		// Apply series filters if configured
		fn := strings.ToUpper(db[:1]) + db[1:]
		if seriesFilter, ferr := ctx.Series.GetFilter(fn); ferr == nil && len(seriesFilter) > 0 {
			filtered := make([]string, 0, len(lines))
			for _, line := range lines {
				for _, f := range seriesFilter {
					if strings.Contains(line, f) {
						filtered = append(filtered, line)
						break
					}
				}
			}
			lines = filtered
		}

		if len(lines) == 0 {
			lines = append(lines, "none")
		}
		ctx.Databases[db] = lines
	}
	logger.InfoG("db.databases.reload", "count", len(prompt.DatabaseNames))
	return nil
}

// loadDatabaseFallback provides fallback to original CSV reading method
func (ctx *Context) loadDatabaseFallback(db, filter string) error {
	_ = filter // delint
	lines, err := storage.ReadDatabaseCSV(db + ".csv")
	if err != nil {
		return err
	}

	// Remove version prefixes
	for i := range lines {
		lines[i] = strings.ReplaceAll(lines[i], "v0.1.0,", "")
	}

	if len(lines) > 0 {
		lines = lines[1:] // skip header
	}

	// Apply series filters
	fn := strings.ToUpper(db[:1]) + db[1:]
	if seriesFilter, ferr := ctx.Series.GetFilter(fn); ferr == nil && len(seriesFilter) > 0 {
		filtered := make([]string, 0, len(lines))
		for _, line := range lines {
			for _, f := range seriesFilter {
				if strings.Contains(line, f) {
					filtered = append(filtered, line)
					break
				}
			}
		}
		lines = filtered
	}

	if len(lines) == 0 {
		lines = append(lines, "none")
	}

	ctx.Databases[db] = lines
	return nil
}

func (ctx *Context) loadSeries(filterIn string) (Series, error) {
	logger.Info("db.load.series", "series", filterIn)
	filter := strings.ToLower(strings.Trim(strings.ReplaceAll(filterIn, " ", "-"), "-"))
	if filterIn != filter {
		logger.Info("db.load.series", "series", filterIn, "normalized", filter)
	}

	fn := filepath.Join(storage.DataDir(), "series", filter+".json")
	str := strings.TrimSpace(file.AsciiFileToString(fn))

	ret := Series{
		Suffix: filter,
	}

	if !file.FileExists(fn) || len(str) == 0 {
		logger.Info("no series found, creating a new file", fn)
		ret.SaveSeries(filter, 0)
		return ret, nil
	}

	if err := json.Unmarshal([]byte(str), &ret); err != nil {
		logger.Error("could not unmarshal series:", err)
		return ret, err
	}

	return ret, nil
}

// SortDatabases sorts in place based on field in spec
func SortDatabases(items []model.Database, sortSpec sdk.SortSpec) error {
	if len(items) < 2 || len(sortSpec.Fields) == 0 {
		return nil
	}
	if len(sortSpec.Order) == 0 {
		sortSpec.Order = append(sortSpec.Order, sdk.Asc)
	}
	field := sortSpec.Fields[0]
	asc := sortSpec.Order[0] == sdk.Asc
	cmp := func(i, j int) bool { return true }
	switch strings.ToLower(field) {
	case "id":
		cmp = func(i, j int) bool { return items[i].ID < items[j].ID }
	case "name":
		cmp = func(i, j int) bool { return items[i].Name < items[j].Name }
	default:
		cmp = func(i, j int) bool { return items[i].Name < items[j].Name }
	}
	sort.SliceStable(items, func(i, j int) bool {
		if asc {
			return cmp(i, j)
		}
		return !cmp(i, j)
	})
	return nil
}
