import { app, BrowserWindow, nativeImage, Tray, Menu } from 'electron'
import { getSelectedText, registerShortcut } from 'electron-selected-text'
import Store from 'electron-store'

Store.initRenderer()

declare var MAIN_WINDOW_WEBPACK_ENTRY: string
declare var MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

let mainWindow: BrowserWindow
let tray: Tray

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()
  registerShortcut('Alt+w', async () => {
    console.log(`Selected Text: ${await getSelectedText()}`)
    mainWindow.show()
    mainWindow.center()
  })

  const icon = nativeImage
    .createFromPath('src/icon.png')
    .resize({ width: 16, height: 16 })
  tray = new Tray(icon)

  // note: your contextMenu, Tooltip and Title code will go here!
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      type: 'normal',
      click: () => {
        createWindow()
      },
    },
    {
      label: 'Help',
      type: 'normal',
      click: () => {
        let win = new BrowserWindow({ width: 800, height: 600 })
        win.loadURL('https://github.com/anc95/writely')
      },
    },
    // https://www.electronjs.org/docs/latest/api/app#appsetloginitemsettingssettings-macos-windows
    // { label: 'Launch at login', type: 'radio', checked: true },
    { label: 'Quit', type: 'normal', click: () => app.quit() },
  ])

  tray.setContextMenu(contextMenu)
  tray.setToolTip('Writely')
})
