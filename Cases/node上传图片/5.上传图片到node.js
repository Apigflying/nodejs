const http = require('http');
const url = require('url');
const util = require('util');
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const server = http.createServer(function(req, res) {
  /* 如果是post请求，并且发送请求的地址是192.168.1.112:80/upload,那么会 */
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    //form插件用来做图片上传时的二进制处理的
    var form = new formidable.IncomingForm();
    //uploadDir是要保存文件的路径
    form.uploadDir = './static/formidableupload';
    form.parse(req, function(err, fields, files) {
      // util.inspect({ fields: fields, files: files });
      //获取文件的拓展名(拿到包括.的所有的扩展名)
      const extname = path.extname(files.tupian.name);
      const t = Date.now() + '' + (Math.random() * 8999 + 10000);
      const oldpath = __dirname + '/' + files.tupian.path;
      const newpath = __dirname + '/static/formidableupload/' + t + extname;
      fs.rename(oldpath, newpath, (err) => {
        res.writeHead(200, { 'content-type': 'text/plain;charset="utf-8"' });
        res.end("成功");
      })
    });
  }
});
//监听的端口是本机的测试端口
//把本机作为node的服务器
server.listen(80, '192.168.1.111');