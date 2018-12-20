const path = require('path');
const relative = '..';
require('node-require-alias').setAlias({
  "controller": path.join(__dirname, relative, "/controller"),
  "config": path.join(__dirname, relative, "/config"),
  "router": path.join(__dirname, relative, "/router"),
  "dao": path.join(__dirname, relative, "/DAO"),
})