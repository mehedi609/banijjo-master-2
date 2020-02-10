const { query } = require('./db_config');
const { sampleSize } = require('lodash');

const getRandomChildArr = async (children, threshold) => {
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

const getRandomProductArr = async (children, threshold) => {
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

const getChildrenFromCategory = async cat_id => {
  return await query(
    `SELECT * FROM category WHERE parent_category_id=${cat_id} AND status='active'`
  );
};

const getCategoryInfoById = async cat_id => {
  return await query(
    `SELECT id, category_name, parent_category_id 
      FROM category 
      WHERE id=${cat_id} AND status='active'`
  );
};

const getProductsFromParent = async id => {
  return await query(
    `SELECT id, category_name, parent_category_id 
     FROM category
     WHERE parent_category_id IN
      (SELECT id FROM category WHERE parent_category_id = ${id} AND status='active')`
  );
};

const getProductsFromChild = async id => {
  return await query(
    `SELECT id, category_name, parent_category_id
     FROM category
     WHERE parent_category_id=${id} AND status='active'`
  );
};

const getProductsByCategoryId = async cat_id => {
  return await query(
    `SELECT *
     FROM products
     WHERE category_id=${cat_id} AND status='active' 
     AND isApprove='authorize' AND softDelete=0`
  );
};

const getCategoryWiseProductList = async (leafChildrenArr, cat_id) => {
  let resArr = [];
  const discountArr = await query(
    `select product_id from discount where softDel=0 and status='active' and curdate() between effective_from and effective_to`
  );

  for (const { id, parent_category_id } of leafChildrenArr) {
    let breadcrumbs = [];
    let productList = [];
    const arr =
      cat_id !== `${parent_category_id}`
        ? [cat_id, parent_category_id, id]
        : [cat_id, id];

    const products = await getProductsByCategoryId(id);
    for (const product of products) {
      const discountAmount = getDiscountByProductId(discountArr, product.id);
      const productWithDiscount = { ...product, discountAmount };
      productList = [...productList, productWithDiscount];
    }

    if (products.length) {
      for (const arrElement of arr) {
        breadcrumbs = [
          ...breadcrumbs,
          ...(await getCategoryInfoById(arrElement))
        ];
      }
    }
    resArr = [...resArr, { breadcrumbs, products: productList }];
  }
  return resArr.filter(({ products }) => products.length);
};

const showProductListByCategory = async cat_id => {
  // clicked on parent category
  const parent = await getProductsFromParent(cat_id);
  if (parent.length) {
    return await getCategoryWiseProductList(parent, cat_id);
  }

  // clicked on child category
  const children = await getProductsFromChild(cat_id);
  if (children.length) {
    return await getCategoryWiseProductList(children, cat_id);
  }

  // click on leaf child
  let resArr = [];
  let productList = [];
  const discountArr = await query(
    `select product_id from discount where softDel=0 and status='active' and curdate() between effective_from and effective_to`
  );
  const products = await getProductsByCategoryId(cat_id);
  const breadcrumbs = await getCategoryInfoById(cat_id);
  for (const product of products) {
    const discountAmount = getDiscountByProductId(discountArr, product.id);
    const productWithDiscount = { ...product, discountAmount };
    productList = [...productList, productWithDiscount];
  }
  resArr = [...resArr, { breadcrumbs, products: productList }];
  return resArr.filter(({ products }) => products.length);
};

// get Discount By ProductId
const getDiscountByProductId = (discountArr, product_id) => {
  let discountAmount = 0;

  for (const item of discountArr) {
    const itemArr = JSON.parse(item['product_id']);
    itemArr.forEach(({ id, discount }) => {
      if (id === `${product_id}`) discountAmount += parseInt(discount);
    });
  }

  return discountAmount;
};

module.exports = {
  getChildrenFromCategory,
  getRandomProductArr,
  getRandomChildArr,
  showProductListByCategory,
  getCategoryInfoById,
  getDiscountByProductId
};
