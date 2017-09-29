const http=require('http');
http.createServer(function(req,res){
    res.writeHead(200,{"Content-Type":"text/plain;charset=UTF8"})
    res.end('这个是最简单的nodejs的页面')
}).listen(80)
console.log('service start')