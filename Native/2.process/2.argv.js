// console.log("argv: ", process.argv);

/**
 argv:  
 [ 
   '/Users/chenxuanyu/.nvm/versions/node/v10.15.0/bin/node', node所在的目录
  '/Users/chenxuanyu/Desktop/nodejs/2.process/2.argv.js', 文件目录
  'a', 参数
  'b', 参数
  'c'  参数
 ]
 */

var myArgs = process.argv.slice(2);
console.log(myArgs);

console.log(process.env);


process.nextTick(()=>{
  console.log(2);
})
setTimeout(() => {
  console.log(1);
}, 0);


process.on('uncaughtException', function(err){
  console.error('got an error: %s', err.message);
  process.exit(1);
});

setTimeout(function(){
  throw new Error('fail');
}, 2000);