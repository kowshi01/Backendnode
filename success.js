const express=require('express');
const path=require('path');
const rootdir=require('../util/path');
const shRoute=express.Router();
shRoute.post('/success',(req,res,next)=>{
    res.sendFile(path.join(rootdir,'views','success.html'));
})
module.exports=shRoute;