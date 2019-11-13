//这个模块里面封装了所有对数据库的操作
const MongoClient = require('mongodb').MongoClient;
//1.链接数据库
const _connectDB = (database = 'abc') => {
    //database为要连接的数据库的名字
    const url = `mongodb://localhost:27017/${database}`;
    return new Promise((resolve, reject) => {
      MongoClient.connect(url, (err, db) => {
        if (err) {
          console.log('连接数据库失败')
          reject(err)
        }
        console.log('连接数据库成功')
        resolve(db)
      })
    })
  }
  /*
    第一个参数是集合的名字，第二个参数是插入的对象
  */

//插入数据
exports.insertOne = (collection, json) => {
    return new Promise((resolve, reject) => {
      _connectDB().then(db => {
        db.collection(collection).insertOne(json, (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result);
          db.close();
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  /*
    查找数据，默认查找这个集合下的所有数据
    可以传入查找条件
    如果传入第三个对象，是用来设置分页信息的
  */

//查找数据
exports.find = (collection, json = {}, pages) => {
  pages = Object.assign({
    n: 0, //每页显示的条数
    page: 0, //页码
    sort: {} //排序的方式
  }, pages);
  let result = [];
  return new Promise((resolve, reject) => {
    _connectDB().then(db => {
      const cursor = db.collection(collection).find(json).skip((pages.page - 1) * pages.n).limit(pages.n).sort(pages.sort)
      cursor.each((err, doc) => {
        if (doc != null) {
          result.push(doc)
        } else {
          resolve(result)
          db.close();
        }
      })
    }).catch(err => {
      reject(err)
    })
  })
}

/*
  删除所有匹配条件的数据{age:12}
*/
//删除数据
exports.deleteMany = (collection, json) => {
    return new Promise((resolve, reject) => {
      _connectDB().then(db => {
        db.collection(collection).deleteMany(json, (err, result) => {
          if (err) {
            reject(err)
          }
          resolve(result)
          db.close();
        })
      }).catch(err => {
        reject(err)
      })
    })
  }
  //更改数据
exports.updateMany = (collection, befor, after) => {
  after = {
    $set: after
  }
  return new Promise((resolve, reject) => {
    _connectDB().then(db => {
      db.collection(collection).updateMany(befor, after, (err, result) => {
        if (err) {
          reject(err)
        }
        resolve(result)
        db.close();
      })
    }).catch(err => {
      reject(err)
    })
  })
}
var _count = (db, collection, json) => {
    return new Promise((resolve, reject) => {
      db.collection(collection).count(json).then(count => {
        resolve(count)
      })
    })

  }
  //获取集合的数据个数
exports.getCount = (collection, json = {}) => {
  return new Promise((resolve, reject) => {
    _connectDB().then(db => {
      _count(db, collection, json).then(count => {
        resolve(count)
      })
      db.close();
    }).catch(err => {
      reject(err)
    })
  })
}