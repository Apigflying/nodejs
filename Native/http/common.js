const http = require('http');
http.createServer(function(req, res) {
  //设置请求头类型和返回到前端的http状态码
  res.writeHead(200, { "Content-Type": "text/plain;charset=UTF8" })
  res.end('这个是最简单的nodejs的页面')
}).listen(4050)
console.log('service start')