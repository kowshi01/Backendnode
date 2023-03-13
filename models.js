//modelsproduct.js
const fs=require('fs');
const path=require('path');
const p=path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'products.json'
);
const productFromFile=(cb)=>{
    fs.readFile(p,(err,data)=>{
        if(err){
           cb([]);
        }else{
            cb(JSON.parse(data));
        }
});
}
module.exports=class Product{
    constructor(titl){
        this.title=titl;
    }
    save(){
        productFromFile(product=>{
            product.push(this);
            fs.writeFile(p,JSON.stringify(product),(err)=>{
                console.log(err);
            });
        })
    }
    static fetchAll(cb){
        productFromFile(cb);
    }
}
//controllerproduct.js
const Product=require('../models/modelproduct');
exports.getAddProduct=(req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  }

  exports.postAddProduct=(req, res, next) => {
    const product=new Product(req.body.title);
    product.save();
    res.redirect('/');
  }

  exports.getProduct=(req, res, next) => {
     Product.fetchAll((products)=>{
      res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
      });
     });
  }
