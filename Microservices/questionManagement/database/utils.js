const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: console.log,
});

const Question = sequelize.define('question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  questContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
  },
})

module.exports = { sequelize, Question };