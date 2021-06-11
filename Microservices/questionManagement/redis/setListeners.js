const { Listeners, EntityEnum, ActionEnum } = require('./listeners');
const { Question, Keyword, sequelize } = require('../database/utils');

async function createKeyword(dto) {
  if (!('id' in dto) || !('name' in dto)) {
    console.log('Invalid create message, should have an \'id\' and \'name\' field');
    return;
  }
  const newKeyword = await Keyword.create(dto);
  console.log(`Stored new keyword ${newKeyword.name} with id ${newKeyword.id}`);
  return;
}
async function deleteKeyword(dto) {
  if (!('id' in dto)) {
    console.log('Invalid delete message, should have an \'id\'');
    return;
  }
  const result = await sequelize.transaction(async (t) => {
    const keyword = await Keyword.findByPk(dto.id, { transaction: t });
    if (!keyword)
      return `Keyword with id ${dto.id} not found`;
    await keyword.destroy({ transaction: t });
    return `Keyword with id ${dto.id} deleted`;
  });
  console.log(result);
  return;
}
async function updateKeyword(dto) {
  if (!('id' in dto) || !('name' in dto)) {
    console.log('Invalid update message, should have an \'id\' and \'name\' field');
    return;
  }
  const result = await sequelize.transaction(async (t) => {
    const keyword = await Keyword.findByPk(dto.id, { transaction: t });
    if (!keyword)
      return `Keyword with id ${dto.id} not found`;
    keyword.name = dto.name;
    const newKeyword = await keyword.save({ transaction: t });
    return `Name of keyword with id ${dto.id} update to ${newKeyword.name}`;
  });
  console.log(result);
  return;
}
async function deleteUser(dto) {
  if (!('id' in dto)) {
    console.log('Invalid delete message, should have an \'id\'');
    return;
  }
  const result = await sequelize.transaction(async (t) => {
    const res = await Question.update(
      { user_id: null },
      { where: { user_id: dto.id } },
    );
    return `Deleted user_id from ${res[0]} questions`;
  });
  console.log(result);
  return;
}
const listenerConfig = {
  [EntityEnum.keyword]: {
    [ActionEnum.create]: createKeyword,
    [ActionEnum.delete]: deleteKeyword,
    [ActionEnum.update]: updateKeyword,
  },
  [EntityEnum.user]: {
    [ActionEnum.delete]: deleteUser,
  },
};

const listeners = new Listeners(listenerConfig);

module.exports = { listeners };