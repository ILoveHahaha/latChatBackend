let express = require('express');
let dbConfig = require('../db/DBConfig')
let user = require('../db/usersql')
let mysql = require('mysql')
let client = mysql.createConnection(dbConfig.mysql)
let router = express.Router();

/**
 * state为0表示的是返回错误。1表示的是登陆成功。
 * */

// 登陆验证接口
router.post('/user/login', function(req, res, next) {
  client.query(user.selectUser, [req.body.uid], function (err, result) {
    if (result.length === 0) {
      res.send({
        state: '0',
        msg: '用户不存在'
      })
    }
    else {
      client.query(user.checkLogin, [req.body.uid, req.body.password], function (err, result) {
        if (result.length === 0) {
          res.send({
            state: '0',
            msg: '密码错误'
          })
        }
        else {
          res.send({
            state: '1',
            msg: '登陆成功'
          })
        }
      })
    }
  })
  next()
});

// 注册接口
router.post('/user/register', function (req, res, next) {
  client.query(user.selectUser, [req.body.uid], function (err, result) {
    if (result.length > 0) {
      res.send({
        state: '0',
        msg: '已存在该用户名'
      })
    }
    else {
      client.query(user.insertUser, [req.body.uid, req.body.password], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: err.code
          })
        }
        else {
          client.query(user.insertUserInfo, [req.body.uid, req.body.password], function (err, result) {
            if (err) {
              res.send({
                state: '0',
                msg: err.code
              })
            }
            else {
              client.query(user.insertFriend, [req.body.uid, req.body.uid], function (err, result) {
                if (err) {
                  res.send({
                    state: '0',
                    msg: err.code
                  })
                }
                else {
                  res.send({
                    state: '1',
                    msg: '注册成功'
                  })
                }
              })
            }
          })
        }
      })
    }
    next()
  })
});

// 修改密码接口
router.post('/user/changePsw', function (req, res, next) {
  client.query(user.selectUser, [req.body.uid], function (err, result) {
    if (result === 0) {
      res.send({
        state: 0,
        msg: '不要搞事情啊！'
      })
    }
    else {
      client.query(user.updateUserPsw, [req.body.password, req.body.uid], function (err, result) {
        if (err) {
          res.send({
            state: 0,
            msg: '修改密码出错'
          })
        }
        else {
          res.send({
            state: 1,
            msg: '修改成功'
          })
        }
      })
    }
    // next()
  })
})

module.exports = router;