const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cart-item')
// let offset
const itemsPerPage = 2
exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1
  console.log(page,'hello')
  let totalItems
  Product.count()
  .then((total)=>{
    totalItems = total
    console.log(totalItems,'count function-->total items')
    return Product.findAll({
      offset:(page-1)*itemsPerPage,
      limit:itemsPerPage
    })
  }).then(products => {
      res.json({
        products:products,
        currentPage:page,
        hasNextPage:itemsPerPage*page<totalItems,
        nextPage:Number(page)+1,
        hasPreviousPage:page>1,
        previousPage:page-1,
        lastPage:Math.ceil(totalItems/itemsPerPage),
        firstPage:Math.ceil(totalItems/totalItems)
      }) 
      // res.render('shop/product-list', {
      //   prods: products,
      //   pageTitle: 'All Products',
      //   path: '/products'
      // });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page
  Product.findAll()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {  
  const page = req.query.page || 1
  console.log(page,'cart hello')
  req.user
  .getCart()
  .then(cart => {
    return cart
      .getProducts()
      .then(products=>{
        productDetails = products
        return CartItem.count()
      })
      .then(res=>{
        totalItems=res
      })
      .then(items=>{
        return CartItem.findAll({
          offset:(page-1)*itemsPerPage,
          limit:itemsPerPage
        })
      })
      .then(items => {
        // console.log(products)
        res.status(200).json({
        productDetails:productDetails,
        items:items,
        currentPage:page,
        hasNextPage:itemsPerPage*page<totalItems,
        nextPage:Number(page)+1,
        hasPreviousPage:page>1,
        previousPage:page-1,
        lastPage:Math.ceil(totalItems/itemsPerPage),
        firstPage:Math.ceil(totalItems/totalItems),
        success:true})
        // res.render('shop/cart', {
        //   path: '/cart',
        //   pageTitle: 'Your Cart',
        //   products: products
        // });
      })
      .catch(err =>  res.status(500).json({success:false , message:err}));
  })
  .catch(err=>{
    res.status(500).json({success:false , message:err})
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      res.status(200).json({success:true,message:`successfully added to the cart`})
    })
    .catch(err => res.status(500).json({success:false,message:'Unable to add item to the cart'}));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.params.id;
  CartItem.findOne({where:{
    productId : prodId
  }})
    .then(res => {
      return res.destroy();
    })
    .then(result => {
      console.log('DESTROYED PRODUCT');
    })
    .catch(err => console.log(err));
};

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
