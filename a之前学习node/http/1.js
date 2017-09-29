
'use strict'

var http=require('http');
var server=http.createServer(function (req,res){
	console.log(req.method+':'+req.url);
	res.writeHead(200,{'Content-type':'text/html'});
	res.end('<h1>hellow world!</h1>')
})
server.listen(8081);
console.log(process.argv);
console.log(__dirname);
console.log('servers start');