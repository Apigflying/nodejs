const tools = {};
//解析POST请求中req的参数

/*
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

*/


tools.AnalysisParams = req => {
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

module.exports = tools