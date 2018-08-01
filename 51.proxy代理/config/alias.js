const path = require('path');
const relative = '..';
require('node-require-alias').setAlias({
    "controller": path.join(__dirname, relative ,"/controller"),
    "models":path.join(__dirname, relative ,"/models"),
    "common":path.join(__dirname, relative ,"/common"),
    "config":path.join(__dirname, relative ,"/config"),
    "router":path.join(__dirname, relative ,"/router")
})
