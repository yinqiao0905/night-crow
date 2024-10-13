const parser = require("cron-parser")

const cronTaskTimeParser = (cron, times = 5) => {
    console.log('cron 表达式 :', cron)
    try {
        const interval = parser.parseExpression(cron)
        for (let i = 0; i < times; i++) {
            console.log('下次执行时间: ', interval.next().toString());
        }
    } catch (err) {
        console.log('Error: ' + err.message);
    }
}
// cronTaskTimeParser('0 0 8 * * ?')
module.exports = {
    cronTaskTimeParser
}