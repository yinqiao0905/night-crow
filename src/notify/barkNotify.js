const getConfig = require("../config");
const {BARK_PUSH} = getConfig()
let BARK_ICON = '';
let BARK_SOUND = '';
let BARK_GROUP = '';
const timeout = 15000; //超时时间(单位毫秒)

function barkNotify(text, description, params = {}) {
    const queryString = new URLSearchParams({
        icon: BARK_ICON,
        sound: BARK_SOUND,
        group: BARK_GROUP,
        ...params
    }).toString();
    const url = `${BARK_PUSH}/${encodeURIComponent(text)}/${encodeURIComponent(description)}`
    fetch(url + '?' + queryString, {
        method: 'get',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        signal: AbortSignal.timeout(timeout)
    }).then(res => res.json()).then(() => {
        console.log('发送通知成功')
    }).catch((err) => {
        console.log('通知失败', err)
    })
}

console.log(BARK_PUSH)

// barkNotify('test', 'test content')
module.exports = barkNotify