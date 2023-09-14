const path = require ('path')
const { Client } = require('pg')
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

const db = new Client({
    host : process.env.host,
    user : process.env.user,
    port : process.env.port,
    password : process.env.password,
    database : process.env.database,
})
db._types.setTypeParser(1184, function(stringValue) {
    return new Date(stringValue + "+0000");
})
db.connect((err) => {
    if (err) {
        console.log(err)
        return
    }
    console.log('Database successfully connected')
})

module.exports = db;