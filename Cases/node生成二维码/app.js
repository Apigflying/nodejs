const fs = require('fs')
const gld = require('./modules/Pj1101080001Final.json');
const xhds = require('./modules/Pj1101080002Final.json');
const zh=require('./modules/Pj1101010001.json');
const http = require('http');

var num = 0;
var getImgs = (mes, filename) => {
  if (!mes[num]) {
    console.log('生成完了')
    return
  }
  http.get('http://qr.liantu.com/api.php?&w=400&text=http://qrcode.sagacloud.cn/?md5=' + mes[num].md5, (res) => {
    var imgData = "";
    res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
    res.on("data", function(chunk) {
      imgData += chunk;
    });

    res.on("end", function() {

      fs.writeFile(__dirname + `/${filename}/${mes[num].objectId.toString()} - ${mes[num].projectName.toString()} - ${mes[num].objectName.toString()}.png`, imgData, "binary", function(err) {
        if (err) {
          console.log(err);
          return false
        }
        console.log(num)
        num++;
        getImgs(mes, filename)
      });
    });
  });
}
getImgs(gld.res, '广联达二期')