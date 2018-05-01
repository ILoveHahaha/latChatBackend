let express = require('express');
let dbConfig = require('../db/DBConfig')
let user = require('../db/usersql')
let mysql = require('mysql')
let client = mysql.createConnection(dbConfig.mysql)
let router = express.Router();

// 查看兴趣圈推送，兴趣圈推送以时间顺序来排，用户发送新的帖子或者评论则该帖子将排在最新


// 查看单条帖子


// 对该帖子进行评论


// 对该帖子进行点赞


// 查看发帖人或评论人信息


// 发帖子


// 删除帖子


// 创建兴趣圈


// 删除兴趣圈


// 关注兴趣圈


// 查看兴趣圈帖子


// 查看兴趣圈信息


module.exports = router;