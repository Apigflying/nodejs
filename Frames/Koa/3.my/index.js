//使用babel-core将ES6转换成ES5的语法
require('babel-core/register');
// 添加别名
require('./config/alias');
//开启app.js的服务
require('./app.js');