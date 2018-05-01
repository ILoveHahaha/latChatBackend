let express = require('express');
let dbConfig = require('../db/DBConfig')
let user = require('../db/usersql')
let mysql = require('mysql')
let client = mysql.createConnection(dbConfig.mysql)
let router = express.Router();

// 获取群组信息


// 获取好友信息


module.exports = router;