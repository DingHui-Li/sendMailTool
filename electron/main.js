const { app, BrowserWindow } = require('electron')
const path = require('path')
const NODE_ENV = process.env.NODE_ENV

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // nodeIntegration: true,
      // contextIsolation: false,
      webSecurity: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // mainWindow.loadFile('dist/index.html')
  mainWindow.loadURL(NODE_ENV === 'development' ? "http:localhost:2333" : `file://${path.join(__dirname, '../dist/index.html')}`)
}

app.whenReady().then(() => {
  require('./ipcMain/http')
  require('./ipcMain/parseHtml')
  require('./ipcMain/file')
  require('./ipcMain/send')
  createWindow()

  app.on('activate', function () { })
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})