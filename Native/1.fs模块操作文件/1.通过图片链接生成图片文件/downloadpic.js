//该文件是对加载在线图片到本地的封装
const fs = require('fs')
const http = require('http');
/*---------------------*\
  _savepic传入一个图片地址，通过图片地址返回图片的binary流，binary流可以作为图片文件的内容，将图片显示出来
\*---------------------*/
const _savepic = (url) => {
    return new Promise((resolve, reject) => {
      http.get(url, (res) => {
        var imgData = "";
        res.setEncoding("binary"); //一定要设置response的编码为binary否则会下载下来的图片打不开
        res.on("data", function(chunk) {
          imgData += chunk;
        });
        res.on("end", (err) => {
          if (err) {
            reject(err)
          }
          resolve(imgData)
        });
      })
    })
  }
  /*---------------------*\
      _savepics传入一个图片地址组成的数组，通过图片地址返回图片的binary流组成的数组
  \*---------------------*/
const _savepics = (arr) => {
    return Promise.all(arr.map(item => {
      return _savepic(item)
    }))
  }
  /*---------------------*\
        urls为线上的地址或者线上地址组成的数组
        urls：'http://f10.baidu.com/it/u=3221056985,906277269&fm=72'
            或[
              'http://f10.baidu.com/it/u=3221056985,906277269&fm=72',
              'http://f10.baidu.com/it/u=3221056985,906277269&fm=73']

        dirs为文件夹的名字
  \*---------------------*/
exports.savepic = (urls, dirs) => {
  const re = /\w+\d/g;
  if (typeof urls === 'string') {
    //传入一个地址
    _savepic(urls).then(imgData => {
      const filename = urls.match(re)[0] + '.png'
      fs.writeFile(dirs + filename, imgData, "binary", (err) => {
        if (err) {
          console.log(err);
          return false
        }
        console.log(`生成图片:${filename}成功`)
      });
    })
  }
}