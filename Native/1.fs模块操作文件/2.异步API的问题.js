const http=require('http');
const url=require('url');
const fs=require('fs');
const path=require('path');

/*

  fs模块是异步的请求，会造成一个问题：
  如果请求写在函数里面，而页面中用到了这个函数，那么读取文件的操作是不会阻塞后面的代码的
  而是会继续执行后面的语句
  也就是说，不会等到读取文件拿到结果再去赋值，从而造成该函数后面的语句获取不到这个函数返回的正确结果

  解决方案：将异步变为同步

*/

const server=http.createServer(function(req,res){
  let pathname=url.parse(req.url).pathname;
  console.log(pathname);
  if(pathname=='/favicon.ico')return;
  if(pathname.indexOf('.')==-1){
    //如果请求的是某个路径，并且没有请求带" . "的文件，那么说明访问的是文件夹
    //那么就默认访问这个文件夹下的index文件
    pathname+='/index.html'
  }
  //请求的实际地址，在network中访问的.html和.css和.js以及.jpg文件都会访问这个地址下的文件
  let fileURL="./"+path.normalize('./static/'+pathname);
  //利用path的extname方法，获取地址中的扩展名(以.分割的文件的后缀)
  let extname=path.extname(pathname);
  fs.readFile(fileURL,function(err,data){
    if(err){
      throw err
    }
    /*
      当请求不同的文件时候，设置不同的请求头信息，保证加载对应后缀名的文件
     */
    
    //用回调函数的方式
    // getMine(extname,function(mine){
    //   res.writeHead(200,{'Content-type':`${JSON.parse(mine)[extname]};charset=UTF8`});
    //   res.end(data);
    // })
    
    //用promise的方式
    getMineP(extname).then(mine=>{
      res.writeHead(200,{'Content-type':`${JSON.parse(mine)[extname]};charset=UTF8`});
      res.end(data);
    })
  })
  
})
server.listen(80,'127.0.0.1')

function getMineP(extname){
  return new Promise((resolve,reject)=>{
    fs.readFile('./static/mime.json',(err,data)=>{
      if(err){
        reject(err)
      }
      resolve(data)
    })
  })
}

function getMine(extname,callback){
  fs.readFile('./static/mime.json',(err,data)=>{
    if(err){
      throw Error('找不到文件');
      return;
    }
    callback(data)
  })
}