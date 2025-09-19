package app

import (
	"context"
	"embed"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"time"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/fileserver"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/msgs"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/project"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/skin"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types"
	"github.com/TrueBlocks/trueblocks-explorer/pkg/types/exports"

	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/base"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/config"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/file"
	coreTypes "github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/types"
	"github.com/TrueBlocks/trueblocks-core/src/apps/chifra/pkg/utils"
	dalle "github.com/TrueBlocks/trueblocks-dalle/v2"
	"github.com/TrueBlocks/trueblocks-dalle/v2/pkg/storage"
	sdk "github.com/TrueBlocks/trueblocks-sdk/v5"
	"github.com/joho/godotenv"
	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	Assets      embed.FS
	Preferences *preferences.Preferences
	Projects    *project.Manager
	chainList   *utils.ChainList
	// ADD_ROUTE
	// QUESTION: DO WE ACTUALLY NEED THIS?
	exports *exports.ExportsCollection
	// ADD_ROUTE
	collections []types.Collection
	meta        *coreTypes.MetaData
	fileServer  *fileserver.FileServer
	prefsMu     sync.RWMutex
	ctx         context.Context
	apiKeys     map[string]string
	ensMap      map[string]base.Address
	Dalle       *dalle.Context
	skinManager *skin.SkinManager
}

func NewApp(assets embed.FS) (*App, *menu.Menu) {
	app := &App{
		Projects: project.NewManager(),
		Preferences: &preferences.Preferences{
			Org:  preferences.OrgPreferences{},
			User: preferences.UserPreferences{},
			App:  *preferences.NewAppPreferences(),
		},
		Assets:  assets,
		apiKeys: make(map[string]string),
		ensMap:  make(map[string]base.Address),
	}
	// ADD_ROUTE
	// QUESTION: DO WE ACTUALLY NEED THIS?
	// Note: exports created on-demand per chain/address when needed
	app.exports = nil
	// ADD_ROUTE

	app.collections = make([]types.Collection, 0, 4)

	app.chainList, _ = utils.UpdateChainList(config.PathToRootConfig())

	if file.FileExists(".env") {
		if err := godotenv.Load(); err != nil {
			log.Fatal("Error loading .env file")
		} else if app.apiKeys["openAi"] = os.Getenv("OPENAI_API_KEY"); app.apiKeys["openAi"] == "" {
			log.Fatal("No OPENAI_API_KEY key found")
		}
	}

	app.Dalle = dalle.NewContext()

	configPath := config.PathToRootConfig()
	app.skinManager = skin.NewSkinManager(configPath)
	if err := app.skinManager.Initialize(); err != nil {
		log.Printf("Warning: Failed to initialize skin manager: %v", err)
	}

	appMenu := app.buildAppMenu()
	return app, appMenu
}

// GetContext returns the application's context instance
func (a *App) GetContext() context.Context {
	return a.ctx
}

// Startup initializes the application with context, preferences, and services
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx

	msgs.InitializeContext(ctx)

	org, err := preferences.GetOrgPreferences()
	if err != nil {
		msgs.EmitError("Loading org preferences failed", err)
		return
	}

	user, err := preferences.GetUserPreferences()
	if err != nil {
		msgs.EmitError("Loading user preferences failed", err)
		return
	}

	appPrefs, err := preferences.GetAppPreferences()
	if err != nil {
		msgs.EmitError("Loading app preferences failed", err)
		return
	}

	a.Preferences.Org = org
	a.Preferences.User = user
	a.Preferences.App = appPrefs

	// Initialize file server directly on the dalle OutputDir
	if out := storage.OutputDir(); out != "" {
		if _, err := os.Stat(out); err == nil {
			a.fileServer = fileserver.NewFileServer(out)
			if err := a.fileServer.Start(); err != nil {
				msgs.EmitError("Failed to start image file server", err)
			}
		}
	}

	if len(a.Preferences.App.RecentProjects) > 0 {
		mostRecentPath := a.Preferences.App.RecentProjects[0]
		if file.FileExists(mostRecentPath) {
			_, err := a.Projects.Open(mostRecentPath)
			if err != nil {
				msgs.EmitError("Failed to open recent project", err)
			}
		}
	}
}

// DomReady configures the window and starts monitoring after DOM is ready
func (a *App) DomReady(ctx context.Context) {
	a.ctx = ctx
	if a.IsReady() {
		if !a.Preferences.App.Bounds.IsValid() {
			// Sometimes, during development, the window size is corrupted
			// and we need to reset it to a default value. Should really
			// happen in production.
			a.Preferences.App.Bounds = preferences.NewBounds()
		}
		runtime.WindowSetSize(ctx, a.Preferences.App.Bounds.Width, a.Preferences.App.Bounds.Height)
		runtime.WindowSetPosition(ctx, a.Preferences.App.Bounds.X, a.Preferences.App.Bounds.Y)
		runtime.WindowShow(ctx)
	}
	go a.watchWindowBounds() // if the window moves or resizes, we want to know
}

// BeforeClose saves window bounds and shuts down services before closing
func (a *App) BeforeClose(ctx context.Context) bool {
	x, y := runtime.WindowGetPosition(ctx)
	w, h := runtime.WindowGetSize(ctx)
	a.SaveBounds(x, y, w, h)

	if a.fileServer != nil {
		if err := a.fileServer.Stop(); err != nil {
			log.Printf("Error shutting down file server: %v", err)
		}
	}

	return false // allow window to close
}

// IsReady returns true if the application context is initialized
func (a *App) IsReady() bool {
	return a.ctx != nil
}

// IsInitialized checks if the application has been initialized by looking for a marker file
func (a *App) IsInitialized() bool {
	_, appFolder := preferences.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	return file.FileExists(fn)
}

// SetInitialized creates or removes the initialization marker file
func (a *App) SetInitialized(isInit bool) error {
	_, appFolder := preferences.GetConfigFolders()
	fn := filepath.Join(appFolder, ".initialized")
	if isInit {
		if !file.Touch(fn) {
			return fmt.Errorf("failed to create %s file", fn)
		} else {
			return nil
		}
	} else {
		_ = os.Remove(fn)
		return nil // do not fail even if not found
	}
}

// watchWindowBounds monitors window position and size changes
func (a *App) watchWindowBounds() {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	var lastX, lastY, lastW, lastH int
	for range ticker.C {
		if !a.IsReady() {
			continue
		}
		x, y := runtime.WindowGetPosition(a.ctx)
		w, h := runtime.WindowGetSize(a.ctx)
		if x != lastX || y != lastY || w != lastW || h != lastH {
			a.SaveBounds(x, y, w, h)
			lastX, lastY, lastW, lastH = x, y, w, h
		}
	}
}

// SaveBounds updates and persists the window bounds to preferences
func (a *App) SaveBounds(x, y, w, h int) {
	if !a.IsReady() {
		return
	}

	a.Preferences.App.Bounds = preferences.Bounds{
		X:      x,
		Y:      y,
		Width:  w,
		Height: h,
	}

	_ = preferences.SetAppPreferences(&a.Preferences.App)
}

// GetAppId returns the application identifier
func (a *App) GetAppId() preferences.Id {
	return preferences.GetAppId()
}

// RegisterCollection adds a collection to the application's collection registry
func (a *App) RegisterCollection(collection types.Collection) {
	a.collections = append(a.collections, collection)
}

// getCollectionPage is a generic helper that fetches a typed Page from a collection using the provided payload, pagination, sorting, and filtering parameters.
func getCollectionPage[T any](
	collection interface {
		GetPage(*types.Payload, int, int, sdk.SortSpec, string) (types.Page, error)
	},
	payload *types.Payload,
	first, pageSize int,
	sort sdk.SortSpec,
	filter string,
) (T, error) {
	var zero T

	dataFacet := payload.DataFacet
	page, err := collection.GetPage(payload, first, pageSize, sort, filter)
	if err != nil {
		return zero, err
	}

	typedPage, ok := page.(T)
	if !ok {
		return zero, types.NewValidationError("app", dataFacet, "getCollectionPage",
			fmt.Errorf("GetPage returned unexpected type %T, expected %T", page, zero))
	}

	return typedPage, nil
}
