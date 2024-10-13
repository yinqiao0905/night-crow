const Decimal = require('decimal.js');
const dayjs = require("dayjs");
const crowDatabase = require("./db/crow")
const schedule = require("node-schedule");
const log4js = require('log4js');
const logger = log4js.getLogger('crow');
logger.level = 'all'
const fetchData = () => {
    const url = "https://api.wemixplay.com/info/v2/price-chart?symbol=CROW&range=1h"
    return fetch(url).then(response => response.json())
        .then(response => {
            const {data} = response
            if (data.chart && Array.isArray(data.chart)) {
                return data.chart.reverse().at(0)
            }
            return null
        })
        .catch(error => {
            console.error(error)
            return null
        })
}

const calcAvgValue = async () => {
    const list = await crowDatabase.last24hrsData()
    const total = list.reduce((prev, curr) => {
        return prev.plus(curr.p)
    }, new Decimal(0))
    return total.div(list.length).toString()
}

const outputString = async (data) => {
    const avg = await calcAvgValue()
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    return (`${time} 最新价格：${data.p}, 过去24小时平均价格: ${avg}`)
}

const startCrow = () => {
    fetchData().then(async data => {
        if (data !== null) {
            await crowDatabase.addData(data)
            logger.info(await outputString(data))
        }
    })
}

const checkIsNeedNotify = async () => {
    const todayStart = dayjs().startOf('day').valueOf() / 1000
    const lastNotifyRecord = await crowDatabase.getLatestNotify()
    const priceRecord = await crowDatabase.getLatestData()
    const avg = await calcAvgValue()
    const threshold = 0.7499
    if (lastNotifyRecord) {
        if (lastNotifyRecord.time > todayStart && Number(avg) > threshold) { //说明今天通知过了
            logger.warn('今天已经通知过了，并且已关闭通知')
        }
    } else {
        if (Number(avg) > threshold) {
            notify(await outputString(priceRecord))
        }
    }
}

const notify = (string) => {
    logger.debug('准备发送通知....')
    // fetch(`https://api.day.app/9rjs6Dwc6DcdnH3P6eQa5J/${string}`).then(() => {
    logger.debug('通知成功')
    // })
}

const start = () => {
    schedule.scheduleJob("0/10 * * * * ?", () => {
        startCrow()
    })
    schedule.scheduleJob("0/5 * * * * ?", () => {
        checkIsNeedNotify()
    })
}

module.exports = start


// module.exports = {startCrow, notify}

