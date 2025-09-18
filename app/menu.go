package app

import (
	"runtime"

	"github.com/TrueBlocks/trueblocks-explorer/pkg/preferences"

	"github.com/wailsapp/wails/v2/pkg/menu"
	"github.com/wailsapp/wails/v2/pkg/menu/keys"
	wailsRuntime "github.com/wailsapp/wails/v2/pkg/runtime"
)

// buildAppMenu creates and configures the application menu structure
func (a *App) buildAppMenu() *menu.Menu {
	appMenu := menu.NewMenu()

	// System Menu (added before File menu)
	system := appMenu.AddSubmenu("System")
	system.AddText("Preferences...", keys.CmdOrCtrl("5"), func(_ *menu.CallbackData) {
		// This matches the cmd+5 keyboard shortcut
		// a.ShowPage("settings")
	})
	system.AddSeparator()
	// TODO: add applicastion name to this menu item
	system.AddText("Quit", keys.CmdOrCtrl("q"), a.FileQuit)

	// File Menu
	file := appMenu.AddSubmenu("File")
	file.AddText("New", keys.CmdOrCtrl("n"), a.FileNew)
	file.AddText("Open", keys.CmdOrCtrl("o"), a.FileOpen)
	file.AddText("Save", keys.CmdOrCtrl("s"), a.FileSave)
	file.AddText("Save As", keys.CmdOrCtrl("shift+s"), a.FileSaveAs)

	if runtime.GOOS == "darwin" {
		appMenu.Append(menu.EditMenu())
	}

	// Window Menu
	window := appMenu.AddSubmenu("Window")
	window.AddText("Minimize", keys.CmdOrCtrl("m"), nil) // menu.WindowMinimize)
	window.AddText("Zoom", nil, nil)                     // menu.WindowZoom)

	// Help Menu
	help := appMenu.AddSubmenu("Help")
	// TODO: add applicastion name to this menu item
	aboutLink := "https://" + preferences.GetAppId().Domain + "/about"
	help.AddText("About", nil, func(_ *menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(a.ctx, aboutLink)
	})
	help.AddText("Report Issue", nil, func(_ *menu.CallbackData) {
		wailsRuntime.BrowserOpenURL(a.ctx, preferences.GetAppId().Github+"/issues")
	})

	return appMenu
}
