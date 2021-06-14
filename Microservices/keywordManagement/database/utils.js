const { Sequelize, DataTypes, Op } = require('sequelize');

const sequelize = new Sequelize({
  database: process.env.PGDATABASE,
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  dialect: 'postgres',
  logging: console.log,
});

const Keyword = sequelize.define('keyword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  }
}, { timestamps: false });

const question_keywords_keyword = sequelize.define('question_keywords_keyword', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  questionId: {
    type: DataTypes.INTEGER,
  }
}, { timestamps: false });

Keyword.hasMany(question_keywords_keyword);
question_keywords_keyword.belongsTo(Keyword);

/** Can optionally perform check in an active transaction */
async function keywordsExist(keywords, t) {
  let res;
  const countOptions = { where: { id: { [Op.in]: keywords }}};
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

module.exports = { sequelize, Keyword, question_keywords_keyword, keywordsExist, Op };