const fs = require('fs');
exports.readfile = (path) => {
	return new Promise((resolve, reject) => {
		let stream = fs.createReadStream(path);
		let data = '';
		stream.on('data', (chrunk) => {
			data += chrunk;
		});
		stream.on('end', () => {
			resolve(data)
		});
		stream.on('err',(err)=>{
			console.log(err)
		})
	})
}
exports.writefile = (path,data)=>{
	return new Promise((resolve,reject)=>{
		fs.writeFile(path,data,(err)=>{
			if(err){
				reject(err)
			}
		})
	})
}
