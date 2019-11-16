var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = 5006;

io.on('connection', function (socket) {
  socket.broadcast.emit('user connected');
});

http.listen(PORT,e=>{
	console.log(`服务开启:${PORT}`)
})
