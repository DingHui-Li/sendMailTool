const { ipcMain } = require('electron')
const puppeteer = require('puppeteer-core')
const isDevelopment = process.env.NODE_ENV !== 'production'

let browser = null

ipcMain.handle('send', async (event, { cookie, toId, content, img }) => {
  let cookies = parseCookie(cookie)
  console.log(cookies)
  const browser = await getBrowserInstance()
  const page = await browser.newPage()
  await page.goto('https://www.globalcompanions.com/Login/MailSystem/ComposeMail.aspx',
    {
      timeout: 20 * 1000,
      waitUntil: ['domcontentloaded']
    })
  await page.setCookie(...cookies)
  await page.goto('https://www.globalcompanions.com/Login/MailSystem/ComposeMail.aspx',
    {
      timeout: 0,
      waitUntil: ['networkidle0']
    })
  await page.type('#MAIN_txtBoxClientNum', toId)
  await page.type('#MAIN_txtBoxLetterText', content)
  if (img) {
    img = JSON.parse(img)
    let inputFile = await page.waitForSelector('#MAIN_fileAttachmentPhoto')
    await inputFile.uploadFile(img?.path)
    await page.type('#MAIN_txtBoxAttachmentName', img.name)
    // await page.click('#MAIN_btnUploadAttachment')
  }
  // await page.click('#MAIN_btnSend')
  // await page.reload()
  return ''
})

async function getBrowserInstance() {
  if (!browser) {
    console.log('new browser')
    browser = await puppeteer.launch({
      headless: !isDevelopment,
      executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
      defaultViewport: {
        width: 1349,
        height: 600
      }
    })
  }
  console.log('browser cache')
  return browser
}
function parseCookie(cookieStr) {
  let _arr = []
  JSON.parse(cookieStr).map(item => {
    let _cookie = {}
    item.split(';').map(item2 => {
      let _t = item2.split('=')
      let key = _t[0].trim()
      let value = _t[1] == undefined ? true : _t[1]
      if (key == 'expires') {
        value = new Date(value).getTime()
      }
      _cookie[key] = value
    })
    let _firstKey = Object.keys(_cookie)[0]
    _cookie.name = _firstKey
    _cookie.value = _cookie[_firstKey]
    delete _cookie[_firstKey]
    _arr.push(_cookie)
  })
  // console.log(_arr)
  return _arr
}