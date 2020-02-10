import React from 'react';
import PropTypes from 'prop-types';
import CardToListProducts from '../features/CardToListProducts';

const fileUrl = process.env.REACT_APP_FILE_URL;

const img_src = `${fileUrl}/upload/product/productImages/`;

const ListingSameVendorsSameProducts = ({ products, classes }) => {
  return products.map(({ id, home_image }) => (
    <div className="column" key={id}>
      <CardToListProducts
        classes={classes}
        img_src={img_src + home_image}
        link={`/productDetails/${id}`}
      />
    </div>
  ));
};

ListingSameVendorsSameProducts.propTypes = {
  products: PropTypes.array.isRequired,
  classes: PropTypes.array.isRequired
};

export default ListingSameVendorsSameProducts;
