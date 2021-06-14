const { Listeners, EntityEnum, ActionEnum } = require('./listeners');
const { Keyword, question_keywords_keyword, sequelize, Op, keywordsExist } = require('../database/utils');

async function createRelations(fullDto) {
  if (!Array.isArray(fullDto)) {
    console.log('Invalid create message, expected an array of dto\'s');
    return;
  }
  const keywordIds = [];
  for (const dto of fullDto) {
    if (!('questionId' in dto) || !('keywordId' in dto)) {
      console.log('Invalid create dto, each one should have a \'keywordId\' and \'questionId\' field');
      return;
    } else {
      keywordIds.push(dto.keywordId);
    }
  }
  /** Below snippet probably unnecessary, enforced automatically through the relations (?) */
  if (! await keywordsExist(keywordIds)) {
    console.log('Non existent \'keywordId\' provided');
    return;
  }
  const retVal = await question_keywords_keyword.bulkCreate(fullDto);
  console.log(`Created ${retVal.length} relations`);
  return;
}
async function deleteRelations(dto) {
  if (!('id' in dto)) {
    console.log('Invalid delete message, should have an \'id\'');
    return;
  }
  const retVal = await question_keywords_keyword.destroy({
    where: { questionId: dto.id },
  });
  console.log(`Deleted ${retVal} relations`);
  return;
}

const listenerConfig = {
  [EntityEnum.qHasK]: {
    [ActionEnum.create]: createRelations,
  },
  [EntityEnum.question]: {
    [ActionEnum.delete]: deleteRelations,
  },
};

const listeners = new Listeners(listenerConfig);

module.exports = { listeners };
