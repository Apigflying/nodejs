var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//app.get('/', function(req, res){
//res.sendFile(__dirname + '/3.socket.io.html');
//});
//io是服务器端的事件
io.on('connection', function(socket){
	console.log('有用户连接了')
	//服务器端监听chat messagea的自定义事件
  socket.on('chat messagea', function(msg){
  	console.log('触发事件了')
  	//触发客户端的chat messagea事件，并传递过去数据
    io.emit('chat messagea', msg);
  });
  //服务器端监听disconnect事件(内置的客户端断开连接的事件)
  socket.on('disconnect', function(a){
    console.log('客户端关闭连接了')
  });
  socket.on('ceshi',mes=>{
  	console.log('测试触发事件')
  	console.log(mes)
  })
});

http.listen(5004, function(){
  console.log('服务开启');
});
    