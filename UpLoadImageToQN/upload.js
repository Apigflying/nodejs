let qiniu = require('qiniu'),
  express = require('express'),
  app = express(),
  accessKey = '七牛提供的key',
  secretKey = '七牛提供的key';

var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var options = {
  scope: 'bucket空间',
  expires: 7200
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
console.log(123);
app.get('/',(req,res)=>{
  res.send('链接成功')
})
app.use(ReadStaticFile);

function ReadStaticFile(req, res, next) {
  console.log(req.url)
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    res.send(uploadToken)
  }
}
app.listen(3000)