const express = require('express');
const app = express();
const nfs = require('./module/fs');
const request = require('request');
const path = require('path');
app.all('*', nfs.ACAO) //设置允许跨域
  //使用request读取文件流，并存入到本地
  // request('http://www.baidu.com/img/baidu_jgylogo3.gif').pipe(fs.createWriteStream('doodle.png'))

//另一种方式：
// fs.createReadStream('file.json').pipe(request.put('http://mysite.com/obj.json'))


app.get('/a.json', (req, res) => {
  nfs.readfile(__dirname + '/package.json').then(data => {
    res.send(data)
  })
})
app.get('/b.json', (req, res) => {
  nfs.writefile(__dirname + '/a.json', { "abc": 12132442 }).then(data => {
    res.send(data)
  })
})
app.post('/c', (req, res) => {
  console.log('接收到请求了')
  nfs.postdata(req).then(result => {
    res.send(result)
  })
})

app.listen(3000)