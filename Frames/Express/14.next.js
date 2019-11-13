const express = require('express');
const app = express();

app.get('/test',(req,res,next)=>{
    req.user = 'admin';
    console.log(1);
    next();

},(req,res,next)=>{
    console.log(2);
    console.log(req.user);
    res.send({})

})

app.listen(4000)