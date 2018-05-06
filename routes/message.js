let express = require('express');
let dbConfig = require('../db/DBConfig')
let user = require('../db/usersql')
let mysql = require('mysql')
let client = mysql.createConnection(dbConfig.mysql)
let router = express.Router();
let date = require('./time');

// 获取群组信息
router.post('/groupMessage', function (req, res, next) {
  client.query(user.getGroupMessage, [req.body.gid, req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else {
      res.json(result)
    }
  })
})

// 发送群组信息
router.post('/sendGroupMessage', function (req, res, next) {
  client.query(user.setGroupMessage, [req.body.gid, req.body.uid, req.body.fromid, req.body.gmContent, date()], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else {
      res.send({
        state: '1'
      })
    }
  })
})

// 获取好友信息
router.post('/singleMessage', function (req, res, next) {
  client.query(user.getSingleMessage, [req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else {
      res.json(result)
    }
  })
})

// 发送好友信息
router.post('/sendSingleMessage', function (req, res, next) {
  client.query(user.setSingleMessage, [req.body.uid, req.body.fromid, req.body.toid, req.body.usmMessage, date()], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else {
      res.send({
        state: '1'
      })
    }
  })
})

module.exports = router;