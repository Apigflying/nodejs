#node随记#
标签：nodejs

----------
[TOC]

摘要：node本身的模块
---
> 核心模块
1. http：提供HTTP服务器功能。
2. url：解析URL。
3. fs：与文件系统交互。
4. querystring：解析URL的查询字符串。
5. child_process：新建子进程。
6. util：提供一系列实用小工具。
7. path：处理文件路径。
8. crypto：提供加密和解密功能，基本上是对OpenSSL的包装。

1.http模块
---
### 1.1 http.createServer创建http服务
>1.第一个参数是req,保存了请求信息
>2.第二个参数是res,保存了要提交到前端的信息

- [x] req
- url：发出请求的网址。
- method：HTTP请求的方法。
    >req.method.toLowerCase()=='post'
- headers：HTTP请求的所有HTTP头信息。
- req.addListener方法
```javascript
var alldata = "";
//下面是post请求接收的一个公式
//node为了追求极致，它是一个小段一个小段接收的。
//接受了一小段，可能就给别人去服务了。防止一个过大的表单阻塞了整个进程
req.addListener("data",function(chunk){
    alldata += chunk;
});
//全部传输完毕
req.addListener("end",function(){
    var datastring = alldata.toString();
    res.end("success");
    //将datastring转为一个对象
    var dataObj = querystring.parse(datastring);
    console.log(dataObj);
    console.log(dataObj.name);
    console.log(dataObj.sex);
});
```
- [x] res
- res.setHeader()
在原生nodejs中，要当一个请求跨域了，可以在这个http实例内部，利用res.setHeader的方式来解决这个问题
```javascript
const http=require('http');
http.createServer(function(req,res){
    /* 设置允许跨域的响应头信息 */
	 res.setHeader("Access-Control-Allow-Origin", "*");
	 res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	 res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
	 res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	if(req.url=='/abc'&&req.method.toLowerCase()=='get'){
		res.writeHead(200,{"Content-Type":"text/plain;charset=UTF8"})
		res.end('这个是最简单的nodejs的页面')
	}
}).listen(8000)
```
- res.writeHead()
```javascript
const http=require('http');
const server=http.createServer(function(req,res){
    getMineP(extname).then(mine=>{
    /* 第一个参数是响应码 200为请求成功，404未找到等 */
    /* 
        第二个参数决定了响应数据的类型
        'Content-type':
            ".css":"text/css" ,
            ".dhtml":"text/html" ,
    */
      res.writeHead(200,{'Content-type':`${JSON.parse(mine)[extname]};charset=UTF8`});
      res.end(data);
    })
  })
})
server.listen(80,'127.0.0.1')
```
- res.end() 发送HTTP回应。
- res.write(str) 指定HTTP回应的内容。


### 1.2.处理post请求
当客户端采用POST方法发送数据时，服务器端可以对data和end两个事件，设立监听函数。
```javascript
var http = require('http');
http.createServer(function (req, res) {
  var content = "";
  /* 只有在post请求中有这个 */
  req.on('data', function (chunk) {
  /*node将请求拆分，拿到的数据段需要进行拼接*/
    content += chunk;
  });
  req.on('end', function () {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("You've sent: " + content);
    res.end();
  });
}).listen(8080);
data事件会在数据接收过程中，每收到一段数据就触发一次，接收到的数据被传入回调函数。end事件则是在所有数据接收完成后触发。
```

上传表单提交
----------
>电脑A作为客户端浏览器，来上传文件
电脑B作为node服务器端，用来开启服务
在电脑A端，制作的网页，通过表单，提交数据，如图片，表单信息等
电脑B，用node开启服务，然后就能够监听到电脑A传过来的数据了
```js

电脑A端

客户端用form表单提交上传请求
请求的地址是用node开启的服务器的地址，也就是运行node文件的ip
 <form 
    action="http://192.168.1.112/upload"    
    method="post"   
    enctype="multipart/form-data">
    /* 图片上传的时候，必须要用enctype="multipart/form-data",否则拿不到图片上传的二进制文件 */
    <p>
		姓名 ： <input type="text" name="name">
	</p>
	<p>
		性别 ： 
		 <input type="radio" name="sex" value="男">男
		 <input type="radio" name="sex" value="女">女
    </p>
    <input type="file" name="tupian"/>
</form>
/*
    action是要提交的地址
    也就是用node搭建的服务器的电脑的ip地址
    在用node搭建服务器之后，可以用于提交到node监听的服务器和端口
    然后，node接收到表单数据之后，进行解析、储存等操作
*/
```
```js
电脑B端
const http = require('http');
const url = require('url');
const util = require('util');
const fs = require('fs');
//formidable是用npm加载的上传图片的包
const formidable = require('formidable');
const server = http.createServer(function(req, res) {
  /* 如果在电脑A端的form表单是用post方法提交的请求，并且发送请求的地址是192.168.1.111/upload,那么会将数据提交到这里 */
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    //form插件用来做图片上传时的二进制处理的
    var form = new formidable.IncomingForm();
    //form.uploadDir属性是用来保存文件的路径
    form.uploadDir = './static/formidableupload';
    //文件和提交的数据接收成功后的回调函数
    form.parse(req, function(err, fields, files) {
        /*返回给客户端的内容*/
      res.writeHead(200, { 'content-type': 'text/plain' });
      res.end("成功");
    });
    return;
  }
});
//监听的端口是本机的测试端口
//把本机作为node的服务器
server.listen(80, '192.168.1.111');

```
利用递归，将异步函数变为同步函数
----------------

> - [x] 原理：node在用for循环遍历异步函数的时候，会将所有的事件放入循环队列 从而导致，在回调函数没有执行的时候，就已经输出了

例子：
```
	for(var i=0;i<files.length;i++){
		fs.stat("./album"+files[i],function(err,stats){
			//由于这里面是异步函数，
			if(stats.isDirectory()){
				arr.push(files[i])
			}
		})
	}
	console.log(arr)//空数组，
```
	

> 原因是for循环在一瞬间完成，会将所有的事件加入队列当中，不会等待异步的回调函数返回结果（也就是不会阻塞后面的代码执行）后，再执行

	

想要将异步的，变成同步的
------------

	

> 需要在每次事件的回调函数执行后，再执行下一次的事件 	原理：利用递归，在回调函数内，执行自己
```
利用：匿名函数自执行，和立即执行函数表达式
(function iterator(i){
	if(i==files.length){
		console.log(arr)
		return
	}
	fs.stat("./album/"+files[i],function(err,stats){
		if(stats.isDirectory()){
			arr.push(files[i])
		}
		iterator(i+1)
	})
})(0)
```

exports、module.exports 和 require
-----------------------------

> - [x] exports在暴露一个js文件内的变量|函数的时候，需要将这个变量|函数作为它的属性。因为它本身暴露的是一个对象

> - [x] require一个文件的时候，会执行这个文件内的所有js代码
如：a.js内引用b.js会将b.js文件在a.js文件内执行一遍
```
/*a.js中：暴露*/
var a=1;
function abc(){};
exports.a=a;
exports.b=abc;

/*b.js中：引用*/
var a=require('./a.js')
console.log(a) 
/*
{
    a:1,
    b:function abc(){}
}
*/

```

node_modules文件夹
---------------

> 在node中引入某个模块的时候，没有使用相对路径'../'，那么说明这个模块是在node_modules文件夹下

例如：
```
    import better-scroll from 'better-scroll'
    /*
        引入不带尾缀的模块（文件夹），默认是查找这个文件夹下的index.js文件
    */
```
> node_modules
>>better-scroll
>>>index.js

package.json文件
--------------
package.json文件是用来规划文件夹信息的
新建项目的时候，通过npm init来手动配置一个package.json文件。
name是项目名称
version是版本（遵守“大版本.次要版本.小版本”的格式）=> 1.2.3
```
完整的package.json
{
	"name": "Hello World",
	"version": "0.0.1",
	"author": "张三",
	"description": "第一个node.js程序",
	"keywords":["node.js","javascript"],
	"repository": {
		"type": "git",
		"url": "https://path/to/url"
	},
	"license":"MIT",
	"engines": {"node": "0.10.x"},
	"bugs":{"url":"http://path/to/bug","email":"bug@example.com"},
	"contributors":[{"name":"李四","email":"lisi@example.com"}],
	"scripts": {
	    /* 这个里面决定了npm run dev时执行的文件 */
		"start": "node index.js",
		"dev": "node build/dev-server.js"
	},
	"dependencies": {
	    //dependencies制定了项目运行所以来的模块
		"express": "latest",
		"mongoose": "~3.8.3",
		"handlebars-runtime": "~1.0.12",
		"express3-handlebars": "~0.5.0",
		"MD5": "~1.2.0"
	},
	"devDependencies": {
	    //devDependencies指定项目开发所需要的模块
		"bower": "~1.2.8",
		"grunt": "~0.4.1",
		"grunt-contrib-concat": "~0.3.0",
		"grunt-contrib-jshint": "~0.7.2",
		"grunt-contrib-uglify": "~0.2.7",
		"grunt-contrib-clean": "~0.5.0",
		"browserify": "2.36.1",
		"grunt-browserify": "~1.3.0",
	}
}
```
使用npm init初始化一个package.json文件
```js
name://名字，必填
version://版本，必填
/* 其余都是非必填项 */
description: 项目描述信息
entry point：（index.js(默认是index.js文件)）app.js//可修改
test command:node 1.js//npm run test时执行的命令
...
```

__dirname
----------
绝对路径
在b.js文件内
require('./a.js')
会以当前文件的所在目录进行搜索a.js文件，即使是在其他文件夹下去node b.js这个文件
但是fs模块读取文件，就是相对于cmd终端打开的路径，进行查找了
所以，要用绝对路径；
__dirname绝对路径就是当前node运行文件的绝对地址
以这个地址作为查找基准，文件就能被正确的找到
例子：
```
目录结构：
+ static
|--3.js
+ a.js

a.js文件内
var a=require(__dirname+'/static/3.js')
console.log(a);

/*
    这里__dirname就是指 + a.js文件的绝对路径
*/
```
__filename
---
file那么是当前文件的绝对路径+本文件的名字
与dirname的区别：

 - [ ]  __dirname:
C:\Users\Administrator\Desktop\我的笔记\JSNodes\node

 - [x]  __filename:
C:\Users\Administrator\Desktop\我的笔记\JSNodes\node\3.模块的概念.js






## path模块
> path模块是node用于整理、转换、合并路径的.用于处理路径字符串，不会处理文件

**注：path模块的进入文件夹的方式与cd相似
    cd .. 表示当前路径的上一层路径**
    
### 1. path、fs与exports的冲突问题
> 当在一个封装的功能性的函数中使用了fs、path。然后对外暴露这个函数的时候。路径可能会产生问题
```js
// createToken.js
const fs = require('fs');
const path = require('path');

exports = function createToken(){
    return new Promise((resolve,reject)=>{
        fs.readFile('./secret.key',(err,data)=>{
            resolve(data)
        })
    })
}
```
> 引用的文件
```js
const {createToken} = require('../../token/creatToken.js');
// 在引用的时候，就会报路径错误
```
在文件引用的时候，会报错
` Error: ENOENT: no such file or directory, open './secret.key'`


----------
> 解决如上问题：
```js
// createToken.js
fs.readFile(path.dirname(__filename)+'/secret.key',(err,data)=>{
    resolve(data)
})
```
**`path.dirname(__filename)+'/secret.key'`**  ，用来解决这个问题

## cookie
> - [ ] 由于http是无状态协议，当浏览一个页面，从这个页面跳转到另一个页面的时候，服务器无法认识到，这是同一台浏览器访问的，因为每次访问这个服务器的资源的时候，每个访问都是没有关系的
 如：
    访问淘宝的页面，从淘宝首页跳转到搜索页面，访问的是同一个服务器上的不同资源，但是服务器需要知道是谁在访问这个页面，从而将结果递交给浏览器客户端
>
- [x] cookie营运而生
当浏览器访问一个页面的时候，服务器在下行HTTP报文中，命令浏览器存储一个字符串：浏览器再次访问这个服务器的域的时候，会将这个字符串携带到HTTP请求中，由HTTP解析，来判断当前用户是谁，然后将要显示的页面递交给这个用户
cookie的格式非常自由
可以是"abc":123;
也可以是"name"={"xyz":"must"}
一般请情况下是以key=value的形式;

cookie的特点：
>- 1.cookie是不加密的，用户可以自由看到；
- 2.用户可以删除cookie或者禁用它
- 3.cookie可以被篡改
- 4.cookie可以用于攻击
- 5.cookie存储量很小，3K

在express中
res负责设置下行cookie
req负责传递上行cookie
在客户端第一次发送请求到服务器的时候，是没有携带cookie的，当发送到服务器之后，由服务器携带cookie回来，客户端再次请求服务器的时候，就会在req中携带这个cookie，作为身份的标识
![cookie的传输原理][1]
```javascript
const cookieParser = require('cookie-parser');
const app = express();
//使用cookie-parser中间件
使用中间件的目的是为了让res和req能够使用cookie的方法即：req.cookies和res.cookie()
app.use(cookieParser());
app.get('/', (req, res) => {
/*
    cookie一般作为key，value对传输
    res.cookie（
        第一个参数是key,
        第二个参数是value,
        第三个参数是cookie的配置
    ）
*/
  res.cookie('name', 'cxy', {
    maxAge: 900000,
    httpOnly: true
  })
  /*
      再次请求服务器的时候，需要用req.cookies来解析，知道是哪个用户，请求什么
      req.cookies的格式是对象
  */
  res.send(req.cookies);
})
注：
  send之后的语句就不执行了
```
服务器session
---
>session是由服务器下发的，通过cookie传送到客户端，当客户端再次访问服务器的时候，就会携带这个session，服务器再解析，确定用户是谁
通常，session是存在于服务器中的，可以将session保存到数据库，也可以放置于运行内存（如果放在运行内存中，那么访问速度比较快，但是过多的session会占用大量内存，从而导致服务器运行内存减少）中

```javascript
/* 第一次访问首页，没有登录状态，此时提示请登录 */
app.get("/", function(req, res) {
  if (req.session.login == "1") {
    res.send("欢迎" + req.session.username);
  } else {
    res.send("请登录");
  }
});
/* 跳转到登录页面 */
app.get("/login", function(req, res) {
//在登录页面进行用户名和密码的验证，如果这个用户登录了，那么，会将会话状态保存，及通过session保存
  req.session.login = "1"; //设置这个session
  req.session.username = "cxy";
  res.send("你已经成功登陆");
});

```

## nodejs报错
```javascript
//---------------------------
throw er; // Unhandled 'error' event
Error: listen EADDRINUSE :::8001
//通常这个错误的意思是8001端口被占用了

//---------------------------
Unexpected token import
//不能使用import引入
原因是:node不支持ES6的import
解决办法:使用babel-core/register
```


























































[1]: http://osjykr1v3.bkt.clouddn.com/FpXvYttu18E-gtC8Uql5G04D90bd