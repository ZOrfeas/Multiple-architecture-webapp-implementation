const { Listeners, EntityEnum, ActionEnum } = require('./listeners');
const { User, sequelize } = require('../database/utils');

async function updateUser(dto) {
  if (!('id' in dto) || !('email' in dto)){
    console.log('Invalid update message, should have an \'id\' and \'email\' field');
    return;
  }
  const result = await sequelize.transaction(async (t) => {
    const user = await User.findByPk(dto.id, { transaction: t });
    if (!user) 
      return `User with id ${dto.id} not found`;
    user.email = dto.email;
    const newUser = await user.save({ transaction: t });
    return `Email of user with id ${dto.id} updated to ${newUser.email}`;
  })
  console.log(result);
  return;
}

const listenerConfig = {
  [EntityEnum.user]: {
    [ActionEnum.update]: updateUser,
  },
}
const listeners = new Listeners(listenerConfig);

module.exports = { listeners };