const query = require('./db_config');

const showColorCombination = async () => {
  const data = await query(`Select * from Products where id=1`);
  return data;
};

module.exports = { showColorCombination };
