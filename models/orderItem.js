const Sequelize = require('sequelize')

const sequelize = require('../util/database')

const OrderItem = sequelize.define('OrderItem',
 {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity: Sequelize.INTEGER,
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false
  }
}
);

module.exports = OrderItem