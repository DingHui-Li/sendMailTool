import { ref, computed } from 'vue'
import { Account, accountMap, accountCookieMap } from './index'
import { upload__VIEWSTATE, send__VIEWSTATE } from '@/provider/sys'

export let isStartOfTask = ref(false)
export let taskList = ref([])
export let sendSetting = ref({
    onlyVip: false,
    checkRepeat: true,
    concurrency: 10
})


export async function chooseConfigFile() {
    let list = await window.$file()
    accountMap.value = {}
    list.map(item => {
        accountMap.value[item.id] = new Account({ ...item })
    })
}
export function upload(account) {
    send(account)
}
export function send(account) {
    console.log('send')
    window.$send({
        cookie: JSON.stringify(accountCookieMap.value[account.id]),
        toId: '22111843',
        content: `Dear:Roy  
        I am a faithful and caring person, my heart and mind are always open for my close people.  
         Watching tv, reading books. I like to go outing with my best friends.  
         sincerely and honest, and i dont mind rich or poor i am looking for love. 
       Can we talk for a minute? ~
        Yours sincerely Jiayu`,
        img: JSON.stringify(account.imgs[0])
    })
}