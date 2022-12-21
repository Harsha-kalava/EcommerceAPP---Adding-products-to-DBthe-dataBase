const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Backend@10LPA', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
