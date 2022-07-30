import { ref, computed } from 'vue'
import { __VIEWSTATE } from '@/provider/sys'
import { isStartOfTask,taskQueue } from './send'

export class Account {
  id = ''
  pw = ''
  name = ''
  avatar = ''
  template = ''
  imgs = []
  configPath = ''
  status = '就绪'
  interval = 0//定时器id
  newCount = 0
  constructor({ id, pw, template, imgs, configPath }) {
    this.id = id
    this.pw = pw
    this.template = template
    this.imgs = imgs
    this.configPath = configPath
  }
}
export let accountMap = ref({})
export let accountCookieMap = ref({})//id:[Account]
export let sendRecordMap = ref({})//id:[...Account,status]
export let selectedList = ref([])

export function start() {
  isStartOfTask.value = true

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
    },
  }).then(res => {
    if (res.cookie && res.cookie.length > 1) {
      accountCookieMap.value[id] = res.cookie
      window.$http({
        url: 'https://www.globalcompanions.com/default.aspx',
        method: "POST",
        jat: true,
        headers: {
          Cookie: res.cookie.join(';')
        }
      }).then(res2 => {
        if (res2.cookie && res2.cookie.length > 1) {
          accountCookieMap.value[id] = [...accountCookieMap.value[id], ...res2.cookie]
          accountMap.value[id].status = '登录成功'
          getAccountUserInfo(id)
          loopGetOnlineManList(id)
        } else {
          accountMap.value[id].status = '登录失败,5s后重试'
          setTimeout(() => {
            loginAccount(id)
          }, 5000);
        }
      })

    } else {
      accountMap.value[id].status = '登录失败,5s后重试'
      setTimeout(() => {
        loginAccount(id)
      }, 5000);
    }
  })
}
function getAccountUserInfo(id) {
  window.$http({
    url: "https://www.globalcompanions.com/Login/Home.aspx",
    method: "GET",
    jat: true,
    headers: {
      Cookie: accountCookieMap.value[id].join(';')
    }
  }).then(async res => {
    if (res.body) {
      let _t = await window.$html({ page: 'home', html: res.body })
      _t = JSON.parse(_t)
      accountMap.value[id].name = _t?.name
      accountMap.value[id].avatar = _t?.avatar
    }
  })
}

async function loopGetOnlineManList(id) {
  let _t = 50
  await getInbox(id)
  await getContactsList(id)
  if (accountMap.value[id].interval) {
    clearInterval(accountMap.value[id].interval)
  }
  getOnlineManList(id, { onlines: _t }).then(res => {
    accountMap.value[id].interval = setInterval(() => {
      _t += 1024
      getOnlineManList(id, { onlines: _t }).then(res => {
        accountMap.value[id].status = `新增${res.length}`
      })
    }, 1000 * 35)
  })
}


function getOnlineManList(id, params) {
  accountMap.value[id].status = '查询在线'
  return new Promise((resolve, reject) => {
    window.$http({
      url: 'https://point.globalcompanions.com/updates/onlines/everyone/',
      method: 'GET',
      jar: true,
      qs: {
        ...params
      },
      headers: {
        Cookie: accountCookieMap.value[id].join(';')
      }
    }).then(res => {
      if (res.body) {
        try {
          let data = JSON.parse(res.body)
          pushQueue({ id, list: data[0]?.updates?.map(item => item.member), type: '在线' })
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
  accountMap.value[id].status = '查询联系人'
  return window.$http({
    method: "GET",
    url: 'https://point.globalcompanions.com/updates/contacts/everyone/',
    jar: true,
    qs: { onlines: 50 },
    headers: {
      Cookie: accountCookieMap.value[id].join(';')
    },
  }).then(res => {
    if (res.body) {
      let data = JSON.parse(res.body)
      pushQueue({ id, list: data[0]?.updates?.map(item => item.member), type: '联系人' })
    }
  })
}

function getInbox(id, params = {}) {
  accountMap.value[id].status = '查询收件箱'
  return window.$http({
    url: 'https://www.globalcompanions.com/Login/MailSystem/Inbox.aspx',
    method: 'GET',
    jar: true,
    form: {
      __EVENTTARGET: 'ctl00$MAIN$cntrlInbox$cntrlPager',
      __VIEWSTATE: __VIEWSTATE,
      ...params
    },
    json: true,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Cookie: accountCookieMap.value[id].join(';')
    },
  }).then(async res => {
    if (res.body) {
      let _t = await window.$html({ html: res.body, page: 'inbox' })
      pushQueue({ id, list: _t.list, type: '收件箱' })
      if (sendRecordMap.value[id]?.length < _t.total) {
        return getInbox(id, { __EVENTARGUMENT: 'Next', })
      }
    }
  })
}

//进入队列，等待发送
function pushQueue({ id, list, type }) {
  list.map(item => {
    item.status = '等待中'
    item.type = type
    item.accountId=id
    taskQueue.value.pending.push(item)
  })
  taskQueue.value.pending = removeRepeat(taskQueue.value.pending)
}

//去重
function removeRepeat(arr) {
  let _t = {}
  arr = arr.reduce((total, item) => {
    if (!_t[item.id]) {
      total.push(item)
      _t[item.id] = true
    }
    return total
  }, [])
  return arr
}

//清空
export function clear() {
  Object.keys(accountMap.value).map(item => {
    if (item.interval) {
      clearInterval(item.interval)
    }
  })
  accountMap.value = {}
  sendRecordMap.value = {}
}
//重置进度
export function resetSendRecord() {
  Object.keys(sendRecordMap.value).map(id => {
    sendRecordMap.value[id].map(item => {
      item.status = '等待中'
    })
  })
}