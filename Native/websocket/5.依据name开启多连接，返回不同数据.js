var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


io.on('connection', function (socket) {
  socket.on('ferret', function (name, fn) {
  	if(name=="tobi"){
  		fn('woot');
  	}else if(name=="ab"){
  		fn('abs')
  	}else{
  		fn(null)
  	}
  });
});

http.listen(5005,e=>{
	console.log('服务开启:5005')
})
