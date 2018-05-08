# 解读elm- nodejs

标签（空格分隔）： nodejs

[TOC]

---
## 1. 入口文件
>使用ES6的import 和export default等语法，在普通版本的nodejs中是无法使用的，所以使用babel-core/register插件
**注：在babel6之后，使用babel-core的时候，需要配合babel-preset-es2015**
- `npm install babel-preset-es2015`
- 添加文件.babelrc
```javascript
{
	"presets": ["es2015"]
}
```
这样以后才能在babel6之后的版本中，在nodejs中使用ES6语法了

```javascript
//index.js

//使用babel-core将ES6转换成ES5的语法
require('babel-core/register');
//开启app.js的服务
require('./app.js');
```
## 2.app.js
>接口和静态文件的顺序
```javascript
//app.js
router(app);//所有请求的接口
app.use(history());
app.use(express.static('./public'));//静态文件
app.listen(config.port)
//将提供静态文件放到最后面，可以保证在接口错误的时候，返回当前页面
```
## 3.mongoDB数据库
`使用mongoose链接数据库`
```javascript
'use strict';
import mongoose from 'mongoose';
//config配置文件
import config from 'config-lite';
//连接mongoDB数据库 config.url => 'mongodb://localhost:27017/elm',
//其中elm是数据库的名字
mongoose.connect(config.url, {useMongoClient: true});
mongoose.Promise = global.Promise;
//获取当前连接的实例对象
const db = mongoose.connection;
//当数据库被连接的时候，会触发一次这个函数
db.once('open', () => {
    console.log('连接数据库成功')
})
//当连接数据库出错的时候，会执行这个函数
db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.url, {
        server: {
            auto_reconnect: true
        }
    });
});
//暴露db，在其他文件中对数据库操作
export default db;
```

#使用的插件：
npm插件





