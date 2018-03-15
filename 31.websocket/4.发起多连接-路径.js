var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var chat = io.of('/chat').on('connection', function(socket) {
	socket.emit('a message', {
		that: 'only',
		'/news': 'will get'
	});
	chat.emit('a message', {
		everyone: 'in',
		'/chat': 'will get'
	});
});

var news = io.of('/news').on('connection', function(socket) {
	socket.emit('item', {
		news: 'item'
	});
});

http.listen(5004, function() {
	console.log('服务开启');
});