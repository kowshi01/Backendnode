//controller/contactsuccess.js
const rootdir=require('../util/path');
const path=require('path');
exports.getContact=(req,res,next)=>{
    res.sendFile(path.join(rootdir,'views','contactus.html'));
}

exports.postSuccess=(req,res,next)=>{
    res.sendFile(path.join(rootdir,'views','success.html'));
}

//contactus.js
const express=require('express');
const getContactPage=require('../controller/contactsuccess');
const coRoute=express.Router();
coRoute.get('/contactus',getContactPage.getContact);
module.exports=coRoute;

//success.js
const express=require('express');
const successPage=require('../controller/contactsuccess');
const shRoute=express.Router();
shRoute.post('/success',successPage.postSuccess);
module.exports=shRoute;
