const express = require('express');
const app = express();
const path = require('path');
// app.all('*', function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
//   res.header("Access-Control-Allow-Headers", "X-Requested-With");
//   res.header('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
const testPath = path.resolve(__dirname,'./test/')
app.use('/test', express.static(testPath));

const webpackDist = path.resolve(__dirname,'../../Frames/webpack/webpack-react/dist/')

app.use('/', express.static(webpackDist));

app.get('/api/getTestData',function(req,res,next){
	return res.send({
    success:1,
    data:{
      message:'abcd'
    }
  });
})

app.listen(3000)