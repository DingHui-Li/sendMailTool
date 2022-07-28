const { app, BrowserWindow } = require('electron')
const path = require('path')

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
  mainWindow.loadURL("http:localhost:2333")
}

app.whenReady().then(() => {
  require('./ipcMain/http')
  createWindow()

  app.on('activate', function () { })
  app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})