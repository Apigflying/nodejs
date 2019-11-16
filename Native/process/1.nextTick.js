/* 
  process.nextTick(()=>{
    console.log('abc')
  })
  
  nodejs是由事件驱动的非阻塞IO单线程的，所以程序在同步执行之后，就会关闭（退出）当前程序（如果后续没有事件，或者没有监听端口，如果是监听端口，那么node的程序线程会被挂起，直到有请求发送到该端口的时候，node会触发监听对应路径的函数{回调函数}）
*/

process.nextTick(() => { console.log('netTick函数1') })
process.nextTick(() => { console.log('netTick函数2') })
setTimeout(() => { console.log('setTimeout') }, 0)
console.log('node正序执行的函数1')
new Promise((resolve, reject) => {
  console.log('node正序执行的函数Promise1')
  resolve(() => { console.log('promise的回调函数') })
  console.log('node正序执行的函数Promise2')
}).then((fn) => { fn() })
console.log('node正序执行的函数2')