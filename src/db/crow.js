const connection = require("./mysql")
const log4js = require('log4js');
const logger = log4js.getLogger('crow-db');
logger.level = 'all'
class CrowDataBase {
    constructor(props) {
        this.connection = connection()
    }

    wrapWithPromise(sql) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, (err, response) => {
                if (err) {
                    logger.error(err)
                    reject(err)
                } else {
                    resolve(response)
                }
            })
        })
    }

    addData(data) {
        const sql = `INSERT INTO data (t, p) VALUES (${data.t}, ${data.p})`
        return this.wrapWithPromise(sql)
    }

    last24hrsData() {
        const last24hrsStart = Date.now() / 1000 - 24 * 60 * 60
        return this.wrapWithPromise(`select * from data where data.t > ${last24hrsStart}`)
    }

    listAllData() {
        return this.wrapWithPromise("select * from data")
    }

    addNotify() {
        const time = Date.now() / 1000
        return this.wrapWithPromise(`INSERT INTO notify (time) VALUES (${time})`)
    }

    async getLatestData(){
        try {
            const records = await this.wrapWithPromise("SELECT * from data order by t desc limit 1")
            return records.length ? records.at(0) : null
        } catch (e) {
            return null
        }
    }

    async getLatestNotify(){
        try {
            const records = await this.wrapWithPromise("SELECT * from notify order by time desc limit 1")
            return records.length ? records.at(0) : null
        } catch (e) {
            return null
        }
    }

}

module.exports = new CrowDataBase()