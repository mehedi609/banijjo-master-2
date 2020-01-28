// const { query } = require('./db_local_config');
// const { query } = require("./db_com_bd_config");

const db_tables_plus = ['sales_return_details', 'inv_purchase_details'];
const db_tables_minus = [
  'sales_details',
  'inv_purchase_return_details',
  'product_damage',
];

const _calculateTotalAmount = async params => {
  const { db_tables, productId, colorId, sizeId, query } = params;
  let total_amount = 0;
  let flag = true;

  for (const tables of db_tables) {
    let amount = 0;
    for (const tbl of tables) {
      const query_str = `SELECT productId, colorId, sizeId, sum(quantity) as total_quantity FROM ${tbl}
                          WHERE productId=${productId} AND sizeId=${sizeId} AND colorId=${colorId} AND status=1 AND softDel=0
                          GROUP BY productId, colorId, sizeId `;
      const data = await query(query_str);
      amount += data.length ? data[0].total_quantity : 0;
    }
    if (flag) {
      total_amount += amount;
      flag = false;
    } else total_amount -= amount;
  }

  return total_amount < 0 ? 0 : total_amount;
};

exports.checkInventory = async (req, res) => {
  let total_amount = 0;

  const db_tables = [db_tables_plus, db_tables_minus];

  let { productId, colorId, sizeId } = req.body;
  productId = !!productId ? productId : 0;
  colorId = !!colorId ? colorId : 0;
  sizeId = !!sizeId ? sizeId : 0;

  if (!productId)
    return res.json({ msg: 'A productId is required', total_amount });

  try {
    total_amount = await _calculateTotalAmount(
      db_tables,
      productId,
      colorId,
      sizeId,
    );
    return res.json({ total_amount });
  } catch (e) {
    console.log(e);
    res.status(500).send('Server Error');
  }
};

exports.checkInventoryFunc = async (productId, colorId, sizeId, query) => {
  productId = !!productId ? productId : 0;
  colorId = !!colorId ? colorId : 0;
  sizeId = !!sizeId ? sizeId : 0;

  if (!productId) return 0;

  const db_tables = [db_tables_plus, db_tables_minus];
  const params = { db_tables, productId, colorId, sizeId, query };

  try {
    return await _calculateTotalAmount({ ...params });
  } catch (e) {
    return 0;
  }
};
