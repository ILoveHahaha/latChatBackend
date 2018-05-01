let express = require('express');
let dbConfig = require('../db/DBConfig');
let user = require('../db/usersql');
let mysql = require('mysql');
let client = mysql.createConnection(dbConfig.mysql);
let router = express.Router();

// 用户好友列表
router.post('/friendList', function(req, res, next) {
  client.query(user.getUserFriendList, [encodeURI(req.body.uid)], function (err, result) {
    res.json(result)
  })
  // next()
});

// 加载个人信息
router.post('/myself', function (req, res, next) {
  client.query(user.getMyselfInfo, [req.body.uid], function (err, result) {
    res.send(result)
  })
  // next()
});

// 搜索好友
router.post('/selectFriend', function (req, res, next) {
  let query = '%' + encodeURI(req.body.findFriend) + '%';
  client.query(user.selectUserFriend, [query, query], function (err, result) {
    res.json(result)
  })
  // next()
});

// 申请好友，目前添加好友需要经过申请，后期功能如何修改请看需求文档
router.get('/applyFriend', function (req, res, next) {
  client.query(user.checkMyFriend, [req.query.fromid, req.query.toid, req.query.applyState, req.query.applyMethod, req.query.formTable], function (err, result) {
    if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '申请成功'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '申请失败'
      })
    }
  })
});

// 添加好友
router.get('/insertFriend', function (req, res, next) {
  client.query(user.insertFriend, [req.query.uid, req.query.ufriid], function (err, result) {
    if (result.affectedRows > 0) {
      client.query(user.insertFriend, [req.query.ufriid, req.query.ufriid], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: err.code
          })
        }
        else if (result.affectedRows > 0) {
          res.send({
            state: '1',
            msg: '添加成功'
          })
        }
        else {
          client.query(user.deleteFriend, [req.query.uid, req.query.ufriid], function (err, result) {})
          res.send({
            state: '0',
            msg: '添加失败'
          })
        }
      })
    }
    else {
      res.send({
        state: '0',
        msg: '添加失败'
      })
    }
  })
  // next()
});

// 修改好友备注和好友关系状态
router.get('/changeInfo', function (req, res, next) {
  client.query(user.getFriendShip, [encodeURI(req.query.uid), encodeURI(req.query.ufriid)], function (err, result) {
    let ufInfo = encodeURI(req.query.ufInfo)
    let ufStyle = encodeURI(req.query.ufStyle)
    console.log(req.query.ufInfo + ' ' + req.query.ufStyle)
    if (!req.query.ufInfo) {
      ufInfo = result[0].ufInfo
    }
    else if (!req.query.ufStyle) {
      ufStyle = result[0].ufStyle
    }
    client.query(user.changeFriendShip, [ufInfo, ufStyle, encodeURI(req.query.uid), encodeURI(req.query.ufriid)], function (err, result) {
      res.send(result)
    })
  })
});

// 删除好友
router.post('/deleteFriend', function (req, res, next) {
  client.query(user.getUserFriendList, [encodeURI(req.body.uid)], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '你尚未添加该好友'
      })
    }
    else {
      client.query(user.deleteFriend, [encodeURI(req.body.uid), encodeURI(req.body.ufriid)], function (err, result) {
        if (result.affectedRows > 0) {
          res.send({
            state: '1',
            msg: '删除成功'
          })
        }
        else if (err) {
          res.send({
            state: 0,
            msg: '删除出错'
          })
        }
      })
    }
  })
});

// 群组列表
router.post('/groupList', function (req, res, next) {
  client.query(user.getGroupList, [encodeURI(req.body.uid)], function (err, result) {
    res.json(result)
  })
});

// 群组信息
router.post('/groupInfo', function (req, res, next) {
  client.query(user.checkInGroup, [req.body.gid, req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '你不在该群'
      })
    }
    else {
      client.query(user.getGroupInfo, [req.body.gid], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: '查找失败'
          })
        }
        else if (result === []) {
          res.send({
            state: '0',
            msg: '没有该群'
          })
        }
        else {
          res.json(result)
        }
      })
    }
  })
});

// 获取群组成员，数组经过处理，第一个是群主
router.post('/groupMember', function (req, res, next) {
  client.query(user.checkInGroup, [req.body.gid, req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '你不在该群'
      })
    }
    else {
      let key;
      client.query(user.getGroupMaster, [req.body.gid], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: '未知错误'
          })
        }
        else {
          key = result
        }
      });
      client.query(user.getGroupMember, [req.body.gid], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: '未知错误',
          })
        }
        else {
          let member = result;
          for (let a in member) {
            if (key[0].uid === member[a].uid) {
              member.splice(a, 1)
            }
          }
          member.unshift(key[0])
          res.json(member)
        }
      })
    }
  })
});

// 申请加群
router.get('/insertGroup', function (req, res, next) {
  client.query(user.insertGroup, [req.query.gid, encodeURI(req.query.uid)], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '你已加入此群'
      })
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '添加成功'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '未知错误'
      })
    }
  })
});

// 退出群组
router.get('/exitGroup', function (req, res, next) {
  client.query(user.exitGroup, [req.query.gid, encodeURI(req.query.uid)], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '未知错误'
      })
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '成功退出群组'
      })
    }
    else {
      res.send({
        state: '0',
        msg: '你已退出群组'
      })
    }
  })
});

// 创建群组
router.post('/newGroup', function (req, res, next) {
  client.query(user.newGroup, [req.body.gid, req.body.gname, req.body.uid, req.body.ulogo, req.body.gNotice, req.body.date], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '该群已创建'
      })
    }
    else if (result.affectedRows > 0) {
      client.query(user.insertGroup, [req.body.gid, encodeURI(req.body.uid)], function (err, result) {
        if (err) {
          res.send({
            state: '0',
            msg: '添加出错'
          })
        }
        else if (result.affectedRows > 0) {
          res.send({
            state: '1',
            msg: '成功添加'
          })
        }
      })
    }
    else {
      res.send({
        state: '0',
        msg: '未知错误'
      })
    }
  })
});

// 删除群组
router.get('/deleteGroup', function (req, res, next) {
  console.log(req.query.gid)
  console.log(req.query.uid)
  client.query(user.deleteGroup, [req.query.gid, encodeURI(req.query.uid)], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: '删除失败'
      })
      console.log(1)
    }
    else if (result.affectedRows === 0) {
      res.send({
        state: '0',
        msg: '你没有权限解散改群'
      })
      console.log(2)
    }
    else if (result.affectedRows > 0) {
      res.send({
        state: '1',
        msg: '该群成功解散'
      })
      console.log(3)
    }
  })
});

// 修改群组信息
router.post('/changeGroupList', function (req, res, next) {
  console.log(req.body)
  client.query(user.changeGroupMessage, [req.body.gname, req.body.glogo, req.body.gNotice, req.body.uid, req.body.gid], function (err, result) {
    console.log(err)
    console.log(result)
    if (err) {
      res.send({
        state: '0',
        msg: '未知错误'
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
});

// 转移群主
router.get('/changeGroupMaster', function (req, res, next) {
  client.query(user.checkInGroup, [req.query.gid, req.query.toid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length > 0) {
      client.query(user.changeGroupMaster, [req.query.toid, req.query.fromid, req.query.gid], function (err, result) {
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
      res.send({
        state: '0',
        msg: '该成员不在群组里'
      })
    }
  })
})

// 删除群组某位成员
router.get('/deleteGroupMember', function (req, res, next) {
  client.query(user.deleteGroupMember, [req.query.gid, req.query.masterId, req.query.memberId, req.query.masterId], function (err, result) {
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
})

// 好友信息
router.post('/friendInfo', function (req, res, next) {
  client.query(user.getMyselfInfo, [req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length > 0) {
      res.json(result)
    }
    else {
      res.send({
        state: '0',
        msg: '查无此人'
      })
    }
  })
});

// 修改个人信息
router.post('/changeMyselfInfo', function (req, res, next) {
  client.query(user.changeMyself, [req.body.uname,req.body.ulogo,req.body.usex,req.body.usign,req.body.ucity,req.body.uid], function (err, result) {
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
});

// 检测是否为好友
router.get('/checkFriend', function (req, res, next) {
  client.query(user.getFriendShip, [req.query.uid, req.query.ufriid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length === 0) {
      res.send({
        state: '0',
        msg: '尚未添加此人'
      })
    }
    else {
      res.send({
        state: '1',
        msg: '已经是好友'
      })
    }
  })
});

// 查看自己申请添加好友
router.post('/getInsertFriendList', function (req, res, next) {
  client.query(user.getApplyFriend, [req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length === 0) {
      res.send({
        state: '0',
        msg: '尚未申请好友'
      })
    }
    else {
      res.json(result)
    }
  })
});

// 查看别人请求添加自己
router.post('/getOtherInsertFriendList', function (req, res, next) {
  client.query(user.getOtherApplyFriend, [req.body.uid], function (err, result) {
    if (err) {
      res.send({
        state: '0',
        msg: err.code
      })
    }
    else if (result.length === 0) {
      res.send({
        state: '0',
        msg: '尚未申请好友'
      })
    }
    else {
      res.json(result)
    }
  })
});

// 文件上传


// 文件下载


module.exports = router;