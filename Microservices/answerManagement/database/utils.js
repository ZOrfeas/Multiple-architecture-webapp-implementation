const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: console.log,
});

const Answer = sequelize.define('answer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ansContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
});

module.exports = { sequelize, Answer, Op };