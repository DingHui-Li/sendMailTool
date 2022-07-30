const { ipcMain } = require('electron')
const request = require('request')

ipcMain.handle('http', async (event, options) => {
  let res = await new Promise(resolve => {
    request({ ...options, followRedirect: false, timeout: 30000 }, function (error, response, body) {
      resolve({ error, response, body })
    })
  })
  // console.log(res)
  return {
    cookie: res?.response?.headers['set-cookie'],
    body: res.body,
    statusCode: res?.response?.statusCode,
    error: res.error
  }
})
