const apiModule = require('./api');

const { query } = apiModule;

const showColorCombination = async () => {
  const data = await apiModule.query(`Select * from Products where id=1`);
  return data;
};

module.exports = { showColorCombination };
