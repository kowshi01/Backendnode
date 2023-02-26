//nodepro.js

const express=require('express');
const app=express();
const bodyParse=require('body-parser');
app.use(bodyParse.urlencoded({extended :false}));
const adminRoute=require('./routes/admin');
const shopRoute=require('./routes/shop');
app.use('/admin',adminRoute);
app.use('/shop',shopRoute);
app.use((req,res,next)=>{
    res.status(404).send('<h1>Page not found</h1>');
})
app.listen(4000);

//routes
//admin.js

const express=require('express');
const adRoute=express.Router();
adRoute.get('/add-product',(req,res,next)=>{
    res.send('<form action="/admin/product" method="post"><input type="text" name="title"> <input type="number" name="size"> <button type="submit">Add Product</button></form>');
})
adRoute.post('/product',(req,res,next)=>{
    console.log(req.body);
    res.redirect('/');
})
module.exports=adRoute;

//shop.js

const express=require('express');
const shRoute=express.Router();
shRoute.get('/',(req,res,next)=>{
    res.send('<h1>Hello Express js</h1>');
})
module.exports=shRoute;
