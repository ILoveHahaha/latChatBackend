var nodemailer = require('nodemailer')

// 配置好SMTP客户端
var config = {
  host: 'pop.163.com',
  port: 995,
  auth: {
    user: 'absonTest@163.com',
    pass: 'abcd1234'
  }
}

// 创建SMTP客户端对象
var transporter = nodemailer.createTransport(config)
module.exports = function (mail) {
  transporter.sendMail(mail, function (err, info) {
    if (err) {
      return console.log(err)
    }
    console.log('mail sent:', info.response)
  })
}