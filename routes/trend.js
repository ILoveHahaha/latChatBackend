let express = require('express');
let dbConfig = require('../db/DBConfig')
let user = require('../db/usersql')
let mysql = require('mysql')
let client = mysql.createConnection(dbConfig.mysql)
let router = express.Router();

// 获取动态圈及评论和点评
router.post('/getFriendTrend', function (req, res, next) {
  client.query(user.getFriendTrend, [req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length === 0) {
      res.send({
        state: '0',
        msg: '暂无数据'
      })
    }
    else {
      var data = result
      for (let a of data) {
        // console.log(a.utNo)
        client.query(user.getFriendTrendReply, ['trend', a.utNo], function (err, result) {
          a.replyList = result;
          client.query(user.getVoteTotal, [a.utNo, 'trend'], function (err, result) {
            if (result.length === 0) {
              a.replyTotal = {
                vGood: 0,
                vBad: 0
              }
            }
            else {
              a.replyTotal = {
                vGood: result[0].vGood,
                vBad: result[0].vBad
              };
            }
            client.query(user.getMyselfVote, [a.utNo, a.uid, 'trend'], function (err, result) {
              if (result.length === 0) {
                a.userReplyState = 0;
              }
              else {
                a.userReplyState = result[0].vState
              }
              if (a.utNo === data[data.length - 1].utNo) {
                res.json(data)
              }
            })
          })
        })
      }
    }
  })
});

// 发送动态圈


// 删除个人动态
router.get('/deleteMyselfTrend', function (req, res, next) {
  client.query(user.deleteMyselfTrend, [req.query.uid, req.query.utNo], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '已删除'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '删除错误'
      })
    }
  })
});

// 评论别人动态
router.get('/replyOther', function (req, res, next) {
  client.query(user.replyOther, [req.query.rStyle,req.query.rid,req.query.buid,req.query.uid,req.query.ruid,req.query.rContent,req.query.rTime], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '评论成功'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '评论错误'
      })
    }
  })
});

// 点赞或修改点赞动态
router.get('/setMyselfVote', function (req, res, next) {
  client.query(user.getMyselfVote, [req.query.utNo, req.query.uid, req.query.vStyle], function (err, result) {
    if (err) {

    }
    else if (result.length > 0) {
      client.query(user.changeMyselfVote, [req.query.utNo, req.query.uid, req.query.vStyle], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: err.code
          })
        }
        else if (result.affectedRows > 0) {
          res.send({
            state: '1',
            msg: '修改成功'
          })
        }
        else {
          res.send({
            state: '0',
            msg: '修改失败'
          })
        }
      })
    }
    else {
      client.query(user.setMyselfVote, [req.query.uid, req.query.vState, req.query.vStyle], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: err.code
          })
        }
        else if (result.affectedRows > 0) {
          res.send({
            state: '1',
            msg: '点赞成功'
          })
        }
        else {
          res.send({
            state: '0',
            msg: '点赞错误'
          })
        }
      })
    }
  })
});

// 删除评论
router.get('/deleteReply', function (req, res, next) {
  client.query(user.deleteReply, [req.query.rNo, req.query.rid, req.query.ruid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '删除成功'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '删除失败'
      })
    }
  })
});

module.exports = router;
