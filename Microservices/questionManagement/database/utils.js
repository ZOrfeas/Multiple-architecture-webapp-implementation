const { Sequelize, DataTypes, Op } = require('sequelize');

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
});

const Keyword = sequelize.define('keyword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, { timestamps: false });

Question.belongsToMany(Keyword, { through: 'question_keywords_keyword', timestamps: false });
Keyword.belongsToMany(Question, { through: 'question_keywords_keyword', timestamps: false });

/** Can optionally perform check in an active transaction */
async function keywordsExist(keywords, t) {
  let res;
  const countOptions = { where: { id: { [Op.or]: keywords }}};
  if (t) {
    res = await Keyword.count(countOptions, {transaction: t});
  } else {
    res = await Keyword.count(countOptions);
  }
  if (res === keywords.length) {
    return true;
  } else {
    return false;
  }
}

module.exports = { sequelize, Question, Keyword, keywordsExist, Op};