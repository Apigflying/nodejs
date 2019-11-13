# Express框架
标签（空格分隔）： nodejs

[TOC]

后台框架，相当于原生JS中的jQuery

> 原生Node开发，会有很多问题：
    >>- 呈递静态页面很不方便，需要处理每个http请求,还要考虑304问题
    >>- 路由处理代码不直观，不清晰，需要写很多的正则表达式和字符串函数
    >>- 不能集中精力写业务，要考虑很多其他的东西，很多if判断

1. 基础使用express
----------

```javascript
 - 加载express框架
    npm install express --save
    --save 的意思是将express保存到package.json文件中
 - 在js文件中引用express
    const express=require('express')
    const app=express();
    express是函数，执行之后，有一个返回结果，就是它的实例app
 - app.get('/',(req,res)=>{
        //监听当前路径的根路径
        res.send('返还到页面中的信息')
    })
 - 监听端口号，当本电脑作为服务器的时候
    用客户端浏览器访问：本机IP+8000
    就默认访问的'/'根路径内的内容
    发送到客户端的内容就是：send()的内容
    app.listen(8000)
```
###1.1 中间件回调函数中req和res的方法
```javascript
app.get('/',(req,res)=>{
    req 和 res与原生nodejs中createServer的回调函数的req和res不同
    这里的req和res都是经过封装的
})
```
>- [x] req：
- req.query 保存了请求的参数 （1）
- req.params：动态路由参数，通常是个对象，在匹配动态路由的时候使用（2）
- [x] 常用：
- req.path：获取请求路径
    + 通常是端口号后面的'localhost:3000/abc' ->req.path == '/abc'
- req.is()：判断请求头Content-Type的MIME类型
- req.baseUrl：获取路由当前安装的URL路径
- req.body / req.cookies：获得「请求主体」/ Cookies
- req.originalUrl：获取原始请求URL
- req.get()：获取指定的HTTP请求头
- [ ] 不常用：
- req.app：当callback为外部文件时，用req.app访问express的实例
- req.fresh / req.stale：判断请求是否还「新鲜」
- req.hostname / req.ip：获取主机名和IP地址
- req.protocol：获取协议类型
- req.route：获取当前匹配的路由
- req.subdomains：获取子域名
- req.accepts()：检查可接受的请求的文档类型
- req.acceptsCharsets / req.acceptsEncodings /
- req.acceptsLanguages：返回指定字符集的第一个可接受字符编码
```javascript
/* query */
/cxy?abc=123
app.use('/cxy', (req, res, next) => {
  var num=req.query.abc; -> '123'
  next();
})
```
```javascript
/* （1）params */
客户端访问链接：/cxy/123
app.use('/:username/:id', (req, res, next) => {
  var username = req.params.username; -> 'cxy'
  var id = req.params.id; -> '123'
  next();
})
```
>- [x] res
- [x] 常用：
- res.send()：传送HTTP响应
- res.json()：传送JSON响应
    + 相当于res.send(JSON.stringify({"a":123}))
- res.jsonp()：传送JSONP响应
- res.cookie(name，value [，option])：设置Cookie
- res.get()：返回指定的HTTP头
- res.clearCookie()：清除Cookie
- res.sendFile(path [，options] [，fn])：传送指定路径的文件 -会自动根据文件extension设定Content-Type
- res.set()：设置HTTP头，传入object可以一次设置多个头
- res.status()：设置HTTP状态码
- res.type()：设置Content-Type的MIME类型
- [ ] 不常用：
- res.app：同req.app一样
- res.append()：追加指定HTTP头
- res.set()在res.append()后将重置之前设置的头
- opition: domain / expires / httpOnly / maxAge / path / secure / signed
- res.download()：传送指定路径的文件
- res.location()：只设置响应的Location HTTP头，不设置状态码或者close response
- res.redirect()：设置响应的Location HTTP头，并且设置状态码302



2.动态路由的概念
----------
路由的匹配实质上是字符串的匹配
可以用正则表达式来匹配
```javascript
/* 
    客户端浏览器访问的时候，是不区分大小写的
    aaB和AAb和aAb都能访问当前的路径
*/
app.get(/^\/abc\/([/d]{10})$/,(req,res)=>{
    注：这个路径信息是从域名+端口后面开始的
    如：
        192.168.1.1:8000/abc/1234567890
        这里监听的路径是从8000后面的/开始到最后
        也就是：/abc/1234567890
    
    上面正则匹配的路径是
        以/abc/开头
        以10位数字结尾的路径
})
```

> - [x] 但是通常使用的是动态路由的方式来匹配路径
```javascript
app.get('/abc/:id',(req,res)=>{
    req保存了浏览器客户端输入的地址信息
---
    与vue中的this.$route.params一样，拿到的是动态路由匹配的动态路由参数
---
    req.params记录的动态路由的参数信息
    相当于：
        {
            id:用户输入的动态路由参数value
        }
    
    假如客户端输入：/abc/12345，回车访问这个页面的时候
    
    那么在用node搭建的服务器端，监听这个动态路由的时候，
    就会拿到这个匹配的id
    拿到的param就是
        {
            id:12345
        }
    可以通过req.params['id']或者req.params.id来获取用户要访问的id
})
```
<i class="icon-star" style="color:red;font-size:24px">当动态路由之间有冲突的时候：
</i>

```js
app.get('/abc/:id', (req, res) => {
  res.send('sucess')
  
})
app.get('/:username/:id', (req, res) => {
  var username = req.params.username;
  /* 所有的动态路由参数，都放在params这个对象里面，即使是下层的动态路由，也是以key和value的方式放入到params里面的 */
  var id = req.params.id;
  res.send(username + ':' + id);
})

先写的先匹配。从上至下依次执行

当匹配到/abc/123的时候，上面的两个路由都能够被成功的匹配到，但是遵从的原则是：先写的先匹配
如果'/:username/:id'放到'/abc/:id'的前面，那么会先匹配前面的
后面的就不会再被匹配了
如：
1. 客户端：/abc/123
node:'/abc/:id'写在前面，那么会优先匹配这个路由，然后会返回这个路由内的内容"success"
2. 客户端：/abc/123
node:'/:username/:id'写在前面，会返回abc:123

此时可以调用回调函数的第三个参数：next

app.get('/:username/:id', (req, res, next) => {
  var username = req.params.username;
  var id = req.params.id;
  res.write(username + ':' + id);
  //默认是懒惰模式，找到一个匹配的之后，就停止。 不继续往下找了，需要手动调用next方法，继续执行后面的代码，这样，后面的也会被匹配到
  next();
})
app.get('/abc/:id?', (req, res) => {
  res.end('sucess')
})

```
 3.  app实例的方法：
----------
 - get()
 - post()
 - add()
 - delete()
 - use()
 - listen()
 ...
 ```js
 
 注：在匹配动态路由的时候
 如：/abc/:id
 而不是/abc:id，这种情况无法匹配到正确的路由信息
 
 app.get('对客户端请求的路径进行监听，如果监听到匹配的路径（字符串路径，或者正则表达式），那么就执行这个回调函数'，(req,res)={
    //这个函数是当匹配到当前的路径的时候，执行的回调函数
    ---
    注：这里面是能够使用res.write('向页面中发送要显示的信息')和res.end('向客户端发送的信息以这个字符串为结尾')等node原生的方法的，也就是说，用express相当于搭建好了服务，但是也可以采用原生的方式进行输出
    
    ---
 })
 /*
    实际请求的时候，是用node来进行对路径的一个监听
    当浏览器发送get请求或post请求的时候，执行这里面的回调函数
    app.whenget
    app.whenpost
 */
 ```
4. 中间件
----------
原生node及express存在的问题：
<p style="font-size:20px;color:#055aff">每次有客户端访问node的服务器的时候，都只执行node里的回调函数，而不会重新加载整个node回调函数外部的代码，导致下面的问题</p>

原生node
```js
cosnt  http=require("http");
var a=1;//这条语句在服务器开启的时候，执行且仅执行一次
cosnt server=http.createServer((req,res)=>{
    //每次当客户端访问这个页面的时候，执行的都是这个函数里面的语句
    a++
    res.end(a)
})
所以最终在客户端显示的数字会累加，多少次访问服务器，a就会累加到多少
```
express
```js
同样的在express中，执行的效果同上
const express=require('express');
const app=express();
var a=1;//首次访问的时候执行一次
app.get('/',(req,res)=>{
    //每次客户端发起访问都会执行这里的语句，与原生node相同
    a++;
    res.send(a.toString);
    /* 如果这里send的是一个数字，那么会默认转换成要发送到客户端的状态码如：200 */
})
```
>基于上面的问题：两种解决方案
    >
    1. 调换顺序
        >> 将动态路由匹配的路径放到后面
        express中所有的路由(中间件)的顺序至关重要
        匹配上第一个，就不会往下匹配了
        设计理念：
            具体的往上写，抽象的往下写
    >
    2. 条件判断过滤
        >> 如果满足条件就返回，否则就next()
        调到后面的函数执行
```js
app.get('/:username/:id',(req,res,next)=>{
    const username=req.params.username;
    if(username in ‘数据库’){
        res.send(username)
    }else{
        next();
    }
})
app.get('/abc/123',(req,res,next)=>{
    res.send('abc:123')
})
```
## 5. use中间件
本质上说一个express应用就是在调用各种中间件。
中间件本身是一个函数
中间件的功能
 + 执行任何代码。
 + 修改请求和响应对象。
 + 终结请求-响应循环。
 + 调用堆栈中的下一个中间件。
 
*** 如果当前中间件没有终结请求-响应循环，则必须调用 next() 方法将控制权交给下一个中间件，否则请求就会挂起。 ***
```js

/* 
    use和get，post等都属于中间件，不同的是use在匹配路由的时候，是非懒惰模式，只要路径从左至右包含这个路由名，那么就会被识别到，然后执行里面的回调函数
    如：
        用use 和get 匹配'/admin'
        用use可以匹配到：/admin/12343
                         /admin/dsfsdfs
                         向后扩展
         而用post，get只能匹配第对应的：
                         /admin
                         无法向后扩展
*/
但是在执行这个函数的时候，需要手动调用next()
如果直接写：app.use(function(req,res,next){
        那么默认是'/'
})
app.use('/',(req,res，next)=>{
    //这个函数只要访问这个服务器，就会走这里，如果想让后面的代码执行，那么需要手动调用next
    
    但是这里不能用send，write和end等发送到客户端的函数，因为如果发送一次，就会造成，调用next()函数之后，后面的代码又会send一次
    
    next()
    //才会向下匹配后面的路由，匹配到之后，执行里面的回调函数
})
app.use('/admin',(req,res)=>{
    const filePath=req.originalUrl;
    /* 
        可以用这个方法获取某个文件夹下的所有文件
        因为在发送请求的时候，如：这个文件夹下的index文件。
        依赖于其他页面，那么就会发送更多的请求(css文件等)
    */
    fs.readFile('./public/'+filePath,(err,data)=>{
        if(err){
            next();
            return
        }
        res.send(data.toString());
    })
    res.write(req.originalUrl)//访问的完整路径
    res.write(req.baseUrl)//基础url，就是use函数的第一个参数
    res.end(req.path)// '/'+originUrl-baseUrl剩下的URL
})
```
----------
>为一个请求添加多个中间件
```js
app.get('/test',(req,res,next)=>{
    // 在这里可以处理请求
    next(); //需要手动调用next();来执行下一个回调函数
    // 在这里可以为req和res添加属性
},(req,res,next)=>{
    // 在上面的函数中，为req和res添加的属性在这里会被拿到
    // 上面必须添加next,才能走到这里，而想要继续执行后面的回调函数，需要再次手动调用next()
})
```

>  app.use()里面的接收的是一个函数
- 通常使用第三方插件或者Router：
- 如：Vue.use(VueRouter)
而express自己封装了一个静态目录的管理器：
express.static('./static')就相当于上面的函数
```js
const express = require('express');
const app = express();
const fs = require('fs')
app.use(ReadStaticFile);
function ReadStaticFile(req, res, next) {
  const filePath = req.originalUrl;
  console.log('./static/' + filePath)
  fs.readFile('./static' + filePath, (err, data) => {
    if (err) {
    /* 如果错误，那么继续读取下一个文件引用的文件 */
      next();/*  */
      return
    }
    /* 如果引用了css文件，就会继续在页面中发送请求，读取这个文件，但是由于读取的文件是css，没有设置content-type,所以无法读取成功 */
    res.send(data.toString())
  })
}
app.listen(3000)
app.use(express.static('./static'))
把它作为中间件，那么就是默认读取这个文件夹下的文件，相当于上面的写法，只不过进行了进一步的封装，且会将所有的mime类型进行转化
```
>  - [x] express.static('./static')
    读取静态目录作为目录文件，当客户端访问某个路由的时候，会在这个文件夹下查找对应路由的文件名，找到之后，返还到客户端。当有其他依赖的时候，也可以继续读取，从而加载一个互相依赖的静态服务器资源
    如：
        html依赖css，又依赖js等。。。

## 6.router
router是用来匹配路径，当路径匹配时执行函数
> 实例化express
```javascript
// app.js
import router from './router/index.js';
import express from 'express';
const app = express();
app.use(middleware);//使用中间件
router(app);
/*
    router(app) 相当于在这里添加：
        app.use('/admin',Admin.login);
        ...
    多个use
*/
app.listen(3000)
```
> router/index.js汇总、配置一级路由
```javascript
import admin from './admin.js';
export default app => {
    app.use('/admin',admin)// 实际是admin的router
    /*
        admin.js:
        import Admin from '../controller/admin/admin.js';
        router.get('/login',Admin.login);//登录接口
        router.post('/register',Admin.register)//注册接口
        export default router;
    */
}
```
> 上面的代码，部署完以后，在访问 `/admin/login`get请求时，会执行controller(控制器)里面的代码，从而做出相应的响应
```javascript
// controller/admin/admin.js
import Common form '../common.js';// 通常这个是全局的属性或者方法
class Admin extends Common{
    //这里用super继承
    login(req,res,next){
        //... 满足条件
        res.send({
            // ... 发送到前台的数据
        })
    }
    register(req,res,next){
        // ... 处理post
        res.send({
            // 处理后的结果
        })
    }
}
```
> 处理post请求通常使用formidable的parse来处理；

7.MVC的概念
----------
models        模型
views         视图
controller    控制器
MVC就是把三者分开，放到不同的文件夹里，减少它们之间的耦合，然后彼此之间互相调用

8. 允许跨域访问的设置
---
通过设置响应头信息，解决跨域访问的问题
```javascript
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```