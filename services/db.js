const Sequelize = require('sequelize');

const connectString = 'postgres://postgres:postgres@localhost:5432/mybank';
const db = new Sequelize(connectString);

module.exports = db;