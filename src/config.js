const dotEnv = require("dotenv")
const path = require("path")

const absolutePath = path.resolve(__dirname, '..', '.env')

module.exports = () => {
    return dotEnv.config({
        path: absolutePath
    }).parsed
}