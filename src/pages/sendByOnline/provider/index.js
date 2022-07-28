import { ref, computed } from 'vue'
import axios from '@/plugins/axios'
import { __VIEWSTATE } from '@/provider/sys'

export let onlyVip = ref(false)
export let mode = ref(1)
export let threadNum = ref(5)

class Account {
  id = ''
  pw = ''
  status = '就绪'//登录中，登录失败，查询中，发信中
  interval = 0//定时器id
  newCount = 0
  constructor({ id, pw }) {
    this.id = id
    this.pw = pw
  }
}
export let accountMap = ref({
  "1169659":
    new Account({
      id: "1169659",
      pw: "123456",
    }),
  "1480313":
    new Account({
      id: "1480313",
      pw: "123456",
    }),
})
export let accountCookieMap = ref({})
export let sendRecordMap = ref({})

export function start() {
  Object.keys(accountMap.value).map((id) => {
    loginAccount(id)
  })
}

export function loginAccount(id) {
  accountMap.value[id].status = '登录中'
  return window.$http({
    url: 'https://www.globalcompanions.com/default.aspx',
    method: "POST",
    form: {
      ctl00$Header$cntrlLogin$txtBoxLogin: id,
      ctl00$Header$cntrlLogin$txtBoxPassword: accountMap.value[id].pw,
      ctl00$Header$cntrlLogin$btnLogin: "登录",
      __VIEWSTATE: __VIEWSTATE,
    },
    json: true,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36"
    },
  }).then(res => {
    if (res.cookie && res.cookie.length > 1) {
      accountCookieMap.value[id] = res.cookie.join(';')
      window.$http({
        url: 'https://www.globalcompanions.com/default.aspx',
        method: "POST",
        jat: true,
        headers: {
          Cookie: res.cookie.join(';')
        }
      }).then(res => {
        if (res.cookie && res.cookie.length > 1) {
          accountCookieMap.value[id] = accountCookieMap.value[id] + ";" + res.cookie.join(';')
          loopGetOnlineManList(id)
        } else {
          accountMap.value[id].status = '登录失败2'
        }
      })

    } else {
      accountMap.value[id].status = '登录失败'
    }
  })
}

async function loopGetOnlineManList(id) {
  let _t = 50
  accountMap.value[id].status = '查询中'
  await getContactsList(id)
  getOnlineManList(id, { onlines: _t }).then(res => {
    accountMap.value[id].status = '查询成功'
    accountMap.value[id].interval = setInterval(() => {
      accountMap.value[id].status = '轮询中'
      _t += 1024
      getOnlineManList(id, { onlines: _t }).then(res => {
        accountMap.value[id].status = `新增${res.length}`
      })
    }, 1000 * 35)
  })
}
export function getOnlineManList(id, params) {
  console.log(accountCookieMap.value[id])
  return new Promise((resolve, reject) => {
    window.$http({
      url: 'https://point.globalcompanions.com/updates/onlines/everyone/',
      method: 'GET',
      jar: true,
      qs: {
        ...params
      },
      headers: {
        Cookie: accountCookieMap.value[id]
      }
    }).then(res => {
      console.log(res)
      if (res.body) {
        try {
          let data = JSON.parse(res.body)
          data[0]?.updates?.map(item => {
            item.member.status = '等待中'
            sendRecordMap.value[id].push(item.member)
          })
          resolve(data[0]?.updates)
        } catch (err) {
          reject()
        }
      } else {
        reject()
      }
    })
  })
}
function getContactsList(id) {
  return window.$http({
    method: "GET",
    url: 'https://point.globalcompanions.com/updates/contacts/everyone/',
    jar: true,
    qs: { onlines: 50 },
    headers: {
      Cookie: accountCookieMap.value[id]
    },
  }).then(res => {
    if (res.body) {
      let data = JSON.parse(res.body)
      sendRecordMap.value[id] = data[0]?.updates?.map(item => {
        item.member.status = '等待中'
        return item.member
      }) || []
    }
  })
}