const ws = require('nodejs-websocket');
 
let num=0;
 
var server = ws.createServer(conn=>{
	num++;
	console.log('new user connected :user'+ num);
	//对每个用户发送来的东西进行广播
	conn.nickname='user'+num;
	var usermes = {};
	usermes.type = "enter";
	usermes.data=conn.nickname;
	
	//利用这个函数广播事件，让所有的conn都接收到消息
	broadcast(JSON.stringify(usermes));
	
	conn.on('text',str=>{
		var userstate = {};
		userstate.type = "message";
		userstate.data=str;
		//每个连接到这这ws服务的用户都能够接收到广播的内容
		broadcast(JSON.stringify(userstate));
	});
	conn.on('close',(code,resson)=>{
		var usercolse = {};
		usercolse.type = "close";
		usercolse.data=conn.nickname + '断开连接了';
		broadcast(JSON.stringify(usercolse));
	});
	conn.on('error',(err)=>{})
}).listen(5002)


function broadcast(str){
	//server.connections保存了当前这个server下的所有用户的连接实例即：上面的conn
	server.connections.forEach(collection=>{
		//这里就相当于conn.sendText(str)
		collection.sendText(str)
	})
}
