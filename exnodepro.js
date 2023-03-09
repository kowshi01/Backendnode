const express=require('express');
const path=require('path');
const app=express();
const bodyParse=require('body-parser');
app.use(bodyParse.urlencoded({extended :false}));
const adminRoute=require('./routes/admin');
const shopRoute=require('./routes/shop');
const coRoute=require('./routes/contactus');
const suRoute=require('./routes/success');
app.use(express.static(path.join(__dirname,'public')))
app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(coRoute);
app.use(suRoute);
app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','err.html'));
})
app.listen(4000);