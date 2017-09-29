const express = require('express');
const app = express();
const router = require('./controller')
app.use('./static', express.static('./public'))
console.log(router)
app.use('/', router.showINdex);

app.use('/:albumName', router.showAlbum);

app.listen(3000)