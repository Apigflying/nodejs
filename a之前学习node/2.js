var fs=require('fs');
fs.stat('1.js',function(err,stat){
	if(err){
		console.log(err);
	}else{
		console.log('isFile: '+stat.isFile());
		console.log('isDirectory: '+stat.isDirectory());
		if(stat.isFile()){
			console.log('size: '+stat.size);
			console.log('birth time: '+stat.birthtime);
			console.log('modified time: '+stat.mtime);
		}
	}
})
setInterval(function (){
	
},1000)
// 在一个文件中，如果一直有东西引用，那么在node中，文件不会执行完毕