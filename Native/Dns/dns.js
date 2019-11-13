var dns = require('dns');

/*
  当配置了本地Host时，是否会对查询结果产生影响。

    dns.lookup()：有影响。
    dns.resolve4()：没有影响。
*/
dns.lookup('www.qq.com', function(err, address, family){
    if(err) throw err;
    console.log('配置host后，dns.lokup =>' + address);
});

// 推荐使用
dns.resolve4('www.qq.com', function(err, address, family){
    if(err) throw err;
    console.log('配置host后，dns.resolve4 =>' + address);
});