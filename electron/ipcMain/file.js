const { dialog, ipcMain } = require('electron')
const fs = require('fs')
const readline = require('readline')

const configFileNameMap = {
  account: 'account.txt',
  process: "发送进度.json",
  template: '信件模板.txt'
}

ipcMain.handle('file', async () => {
  let dirPaths = dialog.showOpenDialogSync({
    title: '选择配置文件夹',
    properties: ['openDirectory', 'createDirectory', 'promptToCreate']
  })
  let rootPath = dirPaths[0]
  return loadDir(rootPath)
})

function loadDir(path) {
  let _t = []
  fs.readdirSync(path)?.map(item => {
    let _newPath = path + '/' + item
    let _stat = fs.lstatSync(_newPath)
    if (_stat.isDirectory()) {
      _t = [..._t, ...loadDir(_newPath)]
    } else {
      if (item == configFileNameMap['account']) {
        _t.push(loadConfig(path))
      }
    }
  })
  return _t
}

function loadConfig(path) {
  let id = '', pw = '', template = '', imgs = []
  Object.keys(configFileNameMap).map(key => {
    let filePath = path + '/' + configFileNameMap[key]
    if (key == 'account') {
      let _t = fs.readFileSync(filePath, 'utf-8')?.split('\r\n')
      id = _t[0]
      pw = _t[1]
    } else if (key == 'template') {
      template = fs.readFileSync(filePath, 'utf-8')
    }
  })
  return {
    id,
    pw,
    template,
    imgs: loadAllImg(path),
    configPath: path
  }
}
function loadAllImg(path) {
  return fs.readdirSync(path)?.map(item => {
    if (item.includes('.png') || item.includes('.jpg')) {
      let imgBuf = fs.readFileSync(path + '/' + item)
      return {
        path: path + '/' + item,
        name: item
      }
    }
  }).filter(item => item != undefined)
}
