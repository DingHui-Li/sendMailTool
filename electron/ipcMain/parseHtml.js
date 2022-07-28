const { ipcMain } = require('electron')

const cheerio =require('cheerio')

ipcMain.handle('html',(event,html)=>{
    const $=cheerio.load(html)
    let list=$('#msgLst .item').map(function(i,el){
        let name=$(this).find('.sender span').html()
        let id=$(this).find('.date input')[1]
        id=$(id).attr('value')
    })
    // for (const item of list) {
    //     console.log(item.children())
    //     let name=item.find('.sender span').html()
    //     let id=item.find('.date #MAIN_cntrlInbox_rptInbox_hdnLetterID_0').attr('value')
    //     console.log(name)
    //     console.log(id)
    // }
})