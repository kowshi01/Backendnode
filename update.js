//database.js
const Sequelize = require('sequelize');
const sequelize=new Sequelize('new_schema1','root','kowshika',{dialect : 'mysql' , host : 'localhost'});
module.exports=sequelize;
//product.js
const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Product=sequelize.define('product',{
  id:{
    type:Sequelize.INTEGER,
    autoIncrement:true,
    allowNull:false,
    primaryKey:true
  },
  title:Sequelize.STRING,
  price:{
    type:Sequelize.DOUBLE,
    allowNull:false
  },
  imageUrl:{
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull:false
  }
});

module.exports=Product;
//app.js
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();
const sequelize=require('./util/database');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
.then(()=>{
    app.listen(3000);
})
.catch(err=>console.log(err))

//admin.js
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title : title,
    imageUrl : imageUrl,
    price : price,
    description : description
 })
  .then(()=>{
    console.log('product created');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findByPk(prodId)
  .then( product =>{
    if (!product) {
      return res.redirect('/');
    }
    res.render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: editMode,
      product: product
    });
  })
  .catch(err=>console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findByPk(prodId)
  .then(products =>{
    products.title = updatedTitle;
    products.price = updatedPrice;
    products.imageUrl = updatedImageUrl;
    products.description = updatedDesc;
    return products.save()
  }).then(result=>{
    console.log('product updated');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  })
  .catch(err=>console.log(err))   
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
  .then(products=>{
    return products.destroy();
  }).then(result=>{
    console.log('Delete Product');
    res.redirect('/admin/products');
  })
  .catch(err=>console.log(err))
};

//shop.js
const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
  })
  })
  .catch(err=>{
    console.log(err);
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where :{id:prodId}})
  .then(products=>{
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  })
  .catch(err=>{
    console.log(err);
  });
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
  })
  })
  .catch(err=>console.log(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, product => {
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  Cart.deleteProduct(prodId)
  .then(()=>{
    res.redirect('/cart');
  })
  .catch(err=>{
    console.log(err);
  });
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};

//product-detail.ejs
<%- include('../includes/head.ejs') %>
    </head>

    <body>
        <%- include('../includes/navigation.ejs') %>
        <main class="centered">
            <h1><%= product.title %></h1>
            <hr>
            <div class="image">
                <img src="<%= product.imageUrl %>" alt="<%= product.title %>">
            </div>
            <h2><%= product.price %></h2>
            <p><%= product.description %></p>
            <%- include('../includes/add-to-cart.ejs') %>
        </main>
        <%- include('../includes/end.ejs') %>
                  
   //main.css
 @import url('https://fonts.googleapis.com/css?family=Open+Sans:400,700');

* {
  box-sizing: border-box;
}

body {
  padding: 0;
  margin: 0;
  font-family: 'Open Sans', sans-serif;
}

main {
  padding: 1rem;
  margin: auto;
}

form {
  display: inline;
}

.centered {
  text-align: center;
}

.image{
  height: 20rem;
}

.image img{
  height: 100%;
}
.main-header {
  width: 100%;
  height: 3.5rem;
  background-color: #00695c;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
}

.main-header__nav {
  height: 100%;
  display: none;
  align-items: center;
}

.main-header__item-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
}

.main-header__item {
  margin: 0 1rem;
  padding: 0;
}

.main-header__item a {
  text-decoration: none;
  color: white;
}

.main-header__item a:hover,
.main-header__item a:active,
.main-header__item a.active {
  color: #ffeb3b;
}

.mobile-nav {
  width: 30rem;
  height: 100vh;
  max-width: 90%;
  position: fixed;
  left: 0;
  top: 0;
  background: white;
  z-index: 10;
  padding: 2rem 1rem 1rem 2rem;
  transform: translateX(-100%);
  transition: transform 0.3s ease-out;
}

.mobile-nav.open {
  transform: translateX(0);
}

.mobile-nav__item-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.mobile-nav__item {
  margin: 1rem;
  padding: 0;
}

.mobile-nav__item a {
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
  padding: 0.5rem 2rem;
}

.mobile-nav__item a:active,
.mobile-nav__item a:hover,
.mobile-nav__item a.active {
  background: #00695c;
  color: white;
  border-radius: 3px;
}

#side-menu-toggle {
  border: 1px solid white;
  font: inherit;
  padding: 0.5rem;
  display: block;
  background: transparent;
  color: white;
  cursor: pointer;
}

#side-menu-toggle:focus {
  outline: none;
}

#side-menu-toggle:active,
#side-menu-toggle:hover {
  color: #ffeb3b;
  border-color: #ffeb3b;
}

.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: none;
}

.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
}

.card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
}

.card__header,
.card__content {
  padding: 1rem;
}

.card__header h1,
.card__content h1,
.card__content h2,
.card__content p {
  margin: 0;
}

.card__image {
  width: 100%;
}

.card__image img {
  width: 100%;
}

.card__actions {
  padding: 1rem;
  text-align: center;
}

.card__actions button,
.card__actions a {
  margin: 0 0.25rem;
}

.btn {
  display: inline-block;
  padding: 0.25rem 1rem;
  text-decoration: none;
  font: inherit;
  border: 1px solid #00695c;
  color: #00695c;
  background: white;
  border-radius: 3px;
  cursor: pointer;
}

.btn:hover,
.btn:active {
  background-color: #00695c;
  color: white;
}

.btn.danger {
  color: red;
  border-color: red;
}

.btn.danger:hover,
.btn.danger:active {
  background: red;
  color: white;
}

@media (min-width: 768px) {
  .main-header__nav {
    display: flex;
  }

  #side-menu-toggle {
    display: none;
  }
}
