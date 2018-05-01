// 服务端来控制时间填入数据库，后期要考虑不同时区用户时间的显示，主要由前端负责。
function date() {
  let date = new Date()
  date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' +
    date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  return date;
}
module.exports = date;