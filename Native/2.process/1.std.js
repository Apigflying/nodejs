const fs = require('fs');
// stdout和stdin 表示标准输出和输入流

/** 
 * 该对象的write方法等同于console.log，可用在标准输出向用户显示内容
  console.log = function(d) {
    process.stdout.write(d + '\n');
  };
*/

fs.createReadStream('./files/wow.txt').pipe(process.stdout);