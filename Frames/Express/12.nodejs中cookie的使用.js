/*-----------------------------------*\
   使用express推荐的插件cookie-parser来与前端互相传输cookie
\*-----------------------------------*/
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
//使用cookie-parser中间件
app.use(cookieParser());

app.get('/', (req, res) => {
  /* cookie是以=拼接发送到前端的 */
  res.cookie('name', 'cxy', {
    maxAge: 900000, //设置cookie的保存时间
    httpOnly: true
      /*
        domain：cookie在什么域名下有效，类型为String,。默认为网站域名

        expires: cookie过期时间，类型为Date。如果没有设置或者设置为0，那么该cookie只在这个这个session有效，即关闭浏览器后，这个cookie会被浏览器删除。

        httpOnly: 只能被web server访问，类型Boolean。

        maxAge: 实现expires的功能，设置cookie过期的时间，类型为String，指明从现在开始，多少毫秒以后，cookie到期。

        path: cookie在什么路径下有效，默认为'/'，类型为String

        secure：只能被HTTPS使用，类型Boolean，默认为false
        
        signed:使用签名，类型Boolean，默认为false。`express会使用req.secret来完成签名，需要cookie-parser配合使用`
    
      */

  })
  res.send((JSON.stringify(req.cookies)));
})
app.get('/gonglue', (req, res) => {
  const mudidi = req.query.mudidi;
  const marr = req.cookies.mudidi || [];
  marr.push(mudidi);
  res.cookie('mudidi', marr);
  res.send(mudidi + '旅游攻略')
})

app.listen(5000)