var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testss', { useMongoClient: true, promiseLibrary: global.Promise });

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function(err) {
  if (err) {
    console.log(1234)
  } else {
    console.log('meow');
  }
});