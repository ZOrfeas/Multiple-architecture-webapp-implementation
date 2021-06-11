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

Question.belongsToMany(Keyword, { through: 'question_keywords_keyword' });
Keyword.belongsToMany(Question, { through: 'question_keywords_keyword' });

async function keywordsExist(keywords) {
  res = await Keyword.count({ where: {
    id: { in: keywords },
  }});
  if (res === keywords.length) {
    return true;
  } else {
    return false;
  }
}

module.exports = { sequelize, Question, Keyword, keywordsExist };