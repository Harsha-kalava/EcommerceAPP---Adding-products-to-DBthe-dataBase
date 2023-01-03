const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')


const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/oder')
const OrderItem = require('./models/orderItem')

const app = express();
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.json({extended:false}));
// app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

User.hasMany(Product);
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

User.hasOne(Cart);
Cart.belongsTo(User);

Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

User.hasMany(Order)
Order.belongsTo(User)

Product.belongsToMany(Order,{through:OrderItem})
Order.belongsToMany(Product,{through:OrderItem})

sequelize
  // .sync({ force: true })
  .sync({alter:true})
  .then(result => {
    return User.findByPk(1);
    // console.log(result);
  })
  .then(user => {
    if (!user) {
      return User.create({ name: 'Max', email: 'test@test.com' });
    }
    return user;
  })
  .then(user => {
    // console.log(user);
    return user.createCart();
  })
  .then(cart => {
    console.log('lsitening to 3000')
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
