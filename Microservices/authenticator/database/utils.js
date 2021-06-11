const { Sequelize, DataTypes } = require('sequelize');

// console.log(process.env.PGUSER);
const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: console.log,
});

function testConnection() {
  sequelize.authenticate()
  .then(() => {
    console.log('all-good')
  })
  .catch((err) => {
    console.log(err);
    console.log('all-bad');
  });
}

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
})

async function init() {
  await User.sync();
  console.log('user table created');
}

module.exports = { sequelize, User };