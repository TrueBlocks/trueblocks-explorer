package model

import (
	"bytes"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"text/template"

	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/prompt"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
)

// DalleDress represents a generated prompt and its associated attributes.
type DalleDress struct {
	Original        string                      `json:"original"`
	FileName        string                      `json:"fileName"`
	FileSize        int64                       `json:"fileSize"`
	ModifiedAt      int64                       `json:"modifiedAt"`
	Seed            string                      `json:"seed"`
	Prompt          string                      `json:"prompt"`
	DataPrompt      string                      `json:"dataPrompt"`
	TitlePrompt     string                      `json:"titlePrompt"`
	TersePrompt     string                      `json:"tersePrompt"`
	EnhancedPrompt  string                      `json:"enhancedPrompt"`
	Attribs         []prompt.Attribute          `json:"attributes"`
	AttribMap       map[string]prompt.Attribute `json:"-"`
	SeedChunks      []string                    `json:"seedChunks"`
	SelectedTokens  []string                    `json:"selectedTokens"`
	SelectedRecords []string                    `json:"selectedRecords"`
	ImageURL        string                      `json:"imageUrl"`
	GeneratedPath   string                      `json:"generatedPath"`
	AnnotatedPath   string                      `json:"annotatedPath"`
	DownloadMode    string                      `json:"downloadMode"`
	IPFSHash        string                      `json:"ipfsHash"`
	CacheHit        bool                        `json:"cacheHit"`
	Completed       bool                        `json:"completed"`
	Series          string                      `json:"series"`
}

func (d *DalleDress) String() string {
	jsonData, _ := json.MarshalIndent(d, "", "  ")
	return string(jsonData)
}

func (dd *DalleDress) ExecuteTemplate(t *template.Template, f func(s string) string) (string, error) {
	var buffer bytes.Buffer
	if err := t.Execute(&buffer, dd); err != nil {
		return "", err
	}
	if f == nil {
		return buffer.String(), nil
	}
	return f(buffer.String()), nil
}

func (dd *DalleDress) FromTemplate(templateStr string) (string, error) {
	if dd == nil {
		return "", fmt.Errorf("DalleDress object is nil")
	}
	tmpl, err := template.New("custom").Parse(templateStr)
	if err != nil {
		return "", fmt.Errorf("failed to parse template: %w", err)
	}
	return dd.ExecuteTemplate(tmpl, nil)
}

func (dd *DalleDress) Adverb(short bool) string {
	val := dd.AttribMap["adverb"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

func (dd *DalleDress) Adjective(short bool) string {
	val := dd.AttribMap["adjective"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

func (dd *DalleDress) Noun(short bool) string {
	val := dd.AttribMap["noun"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ", " + parts[2] + ")"
}

func (dd *DalleDress) Emotion(short bool) string {
	val := dd.AttribMap["emotion"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ", " + parts[4] + ")"
}

func (dd *DalleDress) Occupation(short bool) string {
	val := dd.AttribMap["occupation"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return " who works as a " + parts[0] + " (" + parts[1] + ")"
}

func (dd *DalleDress) Action(short bool) string {
	val := dd.AttribMap["action"].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	return parts[0] + " (" + parts[1] + ")"
}

func (dd *DalleDress) ArtStyle(short bool, which int) string {
	val := dd.AttribMap["artStyle"+fmt.Sprintf("%d", which)].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	if strings.HasPrefix(parts[2], parts[0]+" ") {
		parts[2] = strings.Replace(parts[2], (parts[0] + " "), "", 1)
	}
	return parts[0] + " (" + parts[2] + ")"
}

func (dd *DalleDress) HasLitStyle() bool {
	ret := dd.AttribMap["litStyle"].Value
	return ret != "none" && ret != ""
}

func (dd *DalleDress) LitStyle(short bool) string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if short {
		return parts[0]
	}
	if strings.HasPrefix(parts[1], parts[0]+" ") {
		parts[1] = strings.Replace(parts[1], (parts[0] + " "), "", 1)
	}
	return parts[0] + " (" + parts[1] + ")"
}

func (dd *DalleDress) LitStyleDescr() string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	parts := strings.Split(val, ",")
	if strings.HasPrefix(parts[1], parts[0]+" ") {
		parts[1] = strings.Replace(parts[1], (parts[0] + " "), "", 1)
	}
	return parts[1]
}

func (dd *DalleDress) Color(short bool, which int) string {
	val := dd.AttribMap["color"+fmt.Sprintf("%d", which)].Value
	parts := strings.Split(val, ",")
	if short {
		return parts[1]
	}
	return parts[1] + " (" + parts[0] + ")"
}

func (dd *DalleDress) Orientation(short bool) string {
	val := dd.AttribMap["orientation"].Value
	if short {
		parts := strings.Split(val, ",")
		return parts[0]
	}
	ret := `Orient the scene [{ORI}] and make sure the [{NOUN}] is facing [{GAZE}]`
	ret = strings.ReplaceAll(ret, "[{ORI}]", strings.ReplaceAll(val, ",", " and "))
	ret = strings.ReplaceAll(ret, "[{NOUN}]", dd.Noun(true))
	ret = strings.ReplaceAll(ret, "[{GAZE}]", dd.Gaze(true))
	return ret
}

func (dd *DalleDress) Gaze(short bool) string {
	val := dd.AttribMap["gaze"].Value
	if short {
		parts := strings.Split(val, ",")
		return parts[0]
	}
	return strings.ReplaceAll(val, ",", ", ")
}

func (dd *DalleDress) BackStyle(short bool) string {
	val := dd.AttribMap["backStyle"].Value
	val = strings.ReplaceAll(val, "[{Color3}]", dd.Color(true, 3))
	val = strings.ReplaceAll(val, "[{ArtStyle2}]", dd.ArtStyle(false, 2))
	return val
}

func (dd *DalleDress) LitPrompt(short bool) string {
	val := dd.AttribMap["litStyle"].Value
	if val == "none" {
		return ""
	}
	text := `Please give me a detailed rewrite of the following
	prompt in the literary style ` + dd.LitStyle(short) + `. 
	Be imaginative, creative, and complete.
`
	return text
}

// SortDalleDress sorts in place based on field in spec
func SortDalleDress(items []DalleDress, sortSpec sdk.SortSpec) error {
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
	case "original":
		cmp = func(i, j int) bool { return items[i].Original < items[j].Original }
	case "filename":
		cmp = func(i, j int) bool { return items[i].FileName < items[j].FileName }
	case "seed":
		cmp = func(i, j int) bool { return items[i].Seed < items[j].Seed }
	case "prompt":
		cmp = func(i, j int) bool { return items[i].Prompt < items[j].Prompt }
	case "dataprompt":
		cmp = func(i, j int) bool { return items[i].DataPrompt < items[j].DataPrompt }
	case "titleprompt":
		cmp = func(i, j int) bool { return items[i].TitlePrompt < items[j].TitlePrompt }
	case "terseprompt":
		cmp = func(i, j int) bool { return items[i].TersePrompt < items[j].TersePrompt }
	case "enhancedprompt":
		cmp = func(i, j int) bool { return items[i].EnhancedPrompt < items[j].EnhancedPrompt }
	case "attribs":
		cmp = func(i, j int) bool { return len(items[i].Attribs) < len(items[j].Attribs) }
	case "seedchunks":
		cmp = func(i, j int) bool { return len(items[i].SeedChunks) < len(items[j].SeedChunks) }
	case "selectedtokens":
		cmp = func(i, j int) bool { return len(items[i].SelectedTokens) < len(items[j].SelectedTokens) }
	case "selectedrecords":
		cmp = func(i, j int) bool { return len(items[i].SelectedRecords) < len(items[j].SelectedRecords) }
	case "imageurl":
		cmp = func(i, j int) bool { return items[i].ImageURL < items[j].ImageURL }
	case "generatedpath":
		cmp = func(i, j int) bool { return items[i].GeneratedPath < items[j].GeneratedPath }
	case "annotatedpath":
		cmp = func(i, j int) bool { return items[i].AnnotatedPath < items[j].AnnotatedPath }
	case "downloadmode":
		cmp = func(i, j int) bool { return items[i].DownloadMode < items[j].DownloadMode }
	case "ipfshash":
		cmp = func(i, j int) bool { return items[i].IPFSHash < items[j].IPFSHash }
	case "cachehit":
		cmp = func(i, j int) bool { return items[i].CacheHit }
	case "completed":
		cmp = func(i, j int) bool { return items[i].Completed }
	case "series":
		cmp = func(i, j int) bool { return items[i].Series < items[j].Series }
	default:
		cmp = func(i, j int) bool { return items[i].Original < items[j].Original }
	}
	sort.SliceStable(items, func(i, j int) bool {
		if asc {
			return cmp(i, j)
		}
		return !cmp(i, j)
	})
	return nil
}
