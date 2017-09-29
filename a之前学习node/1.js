var a={
	b:1,
	c:2
}
function abc(a,b){
	return a+b;
}

exports.a=a;
module.exports={
	a:a,
	b:abc
}
//程序即将退出时的回调函数
process.on('exit',function(code){
	console.log('zhe'+code);
})