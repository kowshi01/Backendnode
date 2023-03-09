const express=require('express');
const path=require('path');
const rootdir=require('../util/path');
const coRoute=express.Router();
coRoute.get('/contactus',(req,res,next)=>{
    res.sendFile(path.join(rootdir,'views','contactus.html'));
})
module.exports=coRoute;