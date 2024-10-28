const mysql = require("mysql")
let connection = null

const getDatabase = () => {
    if (connection) return connection
    connection = mysql.createConnection({
        host: "127.0.0.1",
        port: "3306",
        user: "root",
        password: "Admin.9527",
        database: "crow",
        useConnectionPooling: true
    })
    connection.connect()
    return connection
}

module.exports = getDatabase