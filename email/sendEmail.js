var send = require('./email')
var mail = {
  from: 'absonTest@163.com',
  subject: 'test',
  to: 'zhengbanbugu@163.com',
  text: '激活'
}
send(mail)