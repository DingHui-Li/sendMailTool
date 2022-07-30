const { ipcMain } = require('electron')

const cheerio = require('cheerio')

ipcMain.handle('html', (event, { html, page }) => {
    const $ = cheerio.load(html)
    if (page == 'inbox') {
        return getInboxList($)
    } else if (page == 'home') {
        return getUserInfo($)
    }
})

function getInboxList($) {
    let list = []
    let total = $($('.letters-info p').children()[1]).html()
    console.log(total)
    $('#msgLst .item').map(function (i, el) {
        let name = $(this).find('.sender span').html()
        let id = $(this).find('.date input')[1]
        id = $(id).attr('value')
        list.push({ id, name, 'public-id': id })
    })
    return {
        list,
        total: Number(total)
    }
}

function getUserInfo($) {
    let name = $('#Header_cntrlLogin_lblLastName').html()
    let avatar = $('#Header_cntrlLogin_imgLadyThubnail').attr('src')
    return JSON.stringify({ name, avatar })
}