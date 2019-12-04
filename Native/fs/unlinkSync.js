const fs = require('fs');
const path = require('path');
// 删除文件

const filePath = path.resolve(__dirname,'./files/1.txt');
fs.unlinkSync(filePath)