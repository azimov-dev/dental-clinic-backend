require('dotenv').config();
const { Sequelize } = require('sequelize');

const {
  DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  }
});

module.exports = sequelize;
