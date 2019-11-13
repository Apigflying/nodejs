const http=require('http');
const url=require('url');
const util=require('util');
const querystring=require('querystring');
const formidable = require('formidable')
const server=http.createServer((req,res)=>{
  if(req.url=='/upload'&&req.method.toLowerCase()=='post'){
    var alldata="";
    req.addListener('data',chunk=>{
      alldata+=chunk;
    })
    req.addListener('end',()=>{
      const datastring=alldata.toString();
      res.end('success');
      const dataObj=querystring.parse(datastring);
      console.log(dataObj)
    })
  }
})
server.listen(80,'192.168.1.112')