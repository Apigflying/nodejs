/*
	在node环境下执行的 
*/
const crypto = require('crypto');

var ntools = {};

//解析POST请求中req的参数
ntools.AnalysisParams = req => {
    return new Promise((resolve, reject) => {
      let alldata = "";
      req.addListener('data', chunk => {
        alldata += chunk;
      })
      req.addListener('end', () => {
        resolve(alldata.toString());
      })
    })
  }
  /* 
  	第一个参数是加密的字符串
  	第二个参数是加密类型  默认是'md5'
  	第三个参数编码方式 ：  'utf8', 'ascii'或者'binary' 默认是‘ascii’
  	第四个参数是加密内容输出的编码方式： 'binary', 'base64'或'hex'
  		
   
  */
ntools.encrypt = (data, cryptType = 'md5', codingType = 'utf8', outputType = 'hex') => {
  var signature = crypto.createHash(cryptType);
  signature.update(data, codingType);
  return signature.digest(outputType)
}

module.exports = ntools;