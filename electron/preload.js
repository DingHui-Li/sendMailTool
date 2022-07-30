const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('$http', options => ipcRenderer.invoke('http', options))
contextBridge.exposeInMainWorld('$html', html => ipcRenderer.invoke('html', html))
contextBridge.exposeInMainWorld('$file', () => ipcRenderer.invoke('file'))
contextBridge.exposeInMainWorld('$send', params => ipcRenderer.invoke('send', params))