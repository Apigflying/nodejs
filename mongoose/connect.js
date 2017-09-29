/*-----------------------------------*\
   链接数据库，定义Schema模板模式
   暴露mongoose.model实例，以便db.js文件操作数据库，增删改查
\*-----------------------------------*/
const mongoose = require("mongoose");
mongoose.Promise = global.Promise; //为了解决过期的问题
const DB_URL = 'mongodb://localhost:27017/abc';
const db = mongoose.connect(DB_URL);
const Schema = mongoose.Schema;
//建立模型
const UserModel = new Schema({
  name: String, //用户名
  password: String, //密码
}, {
  versionKey: false
});

const UserData = mongoose.model("Users", UserModel);
db.connection.on("error", function(error) {
  console.log("数据库连接失败：" + error);
});

db.connection.on("open", function() {
  console.log("数据库连接成功");
})
module.exports = UserData;