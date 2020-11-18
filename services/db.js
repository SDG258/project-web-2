const Sequelize = require('sequelize');

const connectString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/mybank';
const db = new Sequelize(connectString);

module.exports = db;