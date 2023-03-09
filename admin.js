const express=require('express');
const path=require('path');
const rootdir=require('../util/path');
const adRoute=express.Router();
adRoute.get('/add-product',(req,res,next)=>{
    res.sendFile(path.join(rootdir,'views','addpro.html'));
    
})
adRoute.post('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
module.exports=adRoute;