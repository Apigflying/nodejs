const express = require('express');
const routes = require('./routes/index.js');
const config  = require('./config.js');
const db = require('./mongodb/db.js');
const app = express();

routes(app);

app.listen(config.port,()=>{
  console.log(`Server Listen:http://localhost:${config.port}`);
});