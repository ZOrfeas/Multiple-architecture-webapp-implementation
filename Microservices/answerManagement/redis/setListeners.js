const { Listeners, EntityEnum, ActionEnum } = require('./listeners');
const { Answer, sequelize } = require('../database/utils');

async function deleteAnswers(dto) {
  if (!('id' in dto)) {
    console.log('Invalid delete message, should have an \'id\'');
    return;
  }
  const retVal = await Answer.destroy({
    where: { question_id: dto.id },
  });
  console.log(`Deleted ${retVal} answers`);
  return;
}
async function makeUsersNull(dto) {
  if (!('id' in dto)) {
    console.log('Invalid delete message, should have an \'id\'');
    return;
  }
  const result = await Answer.update(
    { user_id: null },
    { where: { user_id: dto.id } },
  );
  console.log(`Deleted user_id from ${result[0]} answers`);
  return;
}
const listenerConfig = {
  [EntityEnum.question]: {
    [ActionEnum.delete]: deleteAnswers,
  },
  [EntityEnum.user]: {
    [ActionEnum.delete]: makeUsersNull,
  }
};

const listeners = new Listeners(listenerConfig);

module.exports = { listeners };