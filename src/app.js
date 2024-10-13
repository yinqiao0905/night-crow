const Koa = require('koa');
const Router = require('koa-router')
const app = new Koa();
const router = new Router();
const dayjs = require("dayjs");
const log4js = require('log4js');
const logger = log4js.getLogger('app');
logger.level = 'all'
const crowDatabase = require("./db/crow")
const startCrow = require("./crow")

router.get('/stopNotify', async (ctx, next) => {
    try {
        const todayStart = dayjs().startOf('day').valueOf() / 1000
        const notify = await crowDatabase.getLatestNotify()

        if (notify && notify.time > todayStart) {
            // ctx.body
        } else {
            await crowDatabase.addNotify()
        }
        ctx.body = {data: 'ok'}
    } catch (error) {
        ctx.body = {error}
    }
    await next()
});

app.use(router.routes());
app.listen(3000, () => {
    startCrow()
    logger.info('This server is running at http://localhost:' + 3000)
})