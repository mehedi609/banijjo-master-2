const { sampleSize } = require('lodash');

exports.getRandomChildArr = async (query, children, threshold) => {
  let filtered_firstChildren = [];

  for (const { id } of children) {
    const data = await query(
      `SELECT COUNT(*) as no_of_children FROM category WHERE parent_category_id=${id}`
    );

    const { no_of_children } = data[0];

    filtered_firstChildren =
      no_of_children > threshold - 1
        ? [...filtered_firstChildren, { id, no_of_children }]
        : [...filtered_firstChildren];
  }

  return filtered_firstChildren.length > threshold
    ? sampleSize(filtered_firstChildren, threshold)
    : filtered_firstChildren;
};

exports.getRandomProductArr = async (query, children, threshold) => {
  let productArr = [];
  for (const { id, category_name, parent_category_id } of children) {
    const data = await query(`SELECT COUNT(*) as no_of_products FROM products WHERE category_id=${id} AND 
                             softDelete=0 AND isApprove='authorize' AND status='active'`);
    const { no_of_products } = data[0];

    if (no_of_products > threshold - 2) {
      let products = await query(`SELECT id, home_image, category_id FROM products WHERE category_id=${id} AND 
                                  softDelete=0 AND isApprove='authorize' AND status='active'`);
      products =
        products.length > threshold
          ? sampleSize(products, threshold)
          : products;

      const cat_info = { id, category_name, parent_category_id };

      if (products.length) {
        productArr = [...productArr, { cat_info, products }];
      }
    }
  }
  return productArr;
};

exports.getChildrenFromCategory = async (query, cat_id) => {
  return await query(
    `SELECT * FROM category WHERE parent_category_id=${cat_id} AND status='active'`
  );
};
