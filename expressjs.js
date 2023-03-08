const express=require('express');
const bodyParse=require('body-parser');
var fs = require('fs');
const usRoute=express();
usRoute.use(bodyParse.urlencoded({extended :false}));
usRoute.get('/',(req,res,next)=>{
    fs.readFile('message.txt',(err,data)=>{
        if(err){
            console.log(err);
            data='no data';
        }
        res.send(`${data}<form onsubmit="document.getElementById('username').value=localStorage.getItem('username')"
         action="/" method="POST"><input id="username" type="hidden" name"username">
         <input id="message" type="text" name"message"><button type="submit">add</button></form>`)

    })
})
usRoute.post('/',(req,res,next)=>{
    fs.writeFileSync("message.txt",`${req.body.username}:${req.body.message}`,{flag :'a'},(err)=>{  
         err?console.log(err) : res.redirect('/')
    })    
})
usRoute.get('/login',(req,res)=>{
    res.send(`<form onsubmit="localStorage.setItem('username',document.getElementById('username').value)"
         action="/login" method="POST"><input id="username" type="text" name"username">
         <button type="submit">add</button></form>`)         
})
    
