const fs = require('fs');
const path = require('path');
// 删除文件

const getFilePath = p => path.resolve(__dirname,'./files/',p)

// 复制第一个参数文件名的文件 到 第二个参数的目录下,同时创建该文件名

// 该条代码,会复制./files/1.txt 到 ./files下,生成 2.txt文件
fs.copyFileSync(getFilePath('1.txt'),getFilePath('2.txt'))

/*
  // 删除原有的1.txt文件
  fs.unlinkSync(getFilePath('1.txt'))
*/