import React from 'react';
import PropTypes from 'prop-types';
import('./../assets/productListBredcrumb.css');

const ProductListBredcrumb = ({ bredcrumbs }) => {
  const { id, category_name } = bredcrumbs.pop();
  return (
    <ul className="breadcrumbProduct">
      {bredcrumbs.length > 0 &&
        bredcrumbs.map(({ id, category_name }) => (
          <li key={id}>
            <a href={`/productList/${id}`}>{category_name}</a>
          </li>
        ))}
      <li>
        <a href={`/productList/${id}`}>{category_name}</a>
      </li>
    </ul>
  );
};

ProductListBredcrumb.propTypes = {
  bredcrumbs: PropTypes.array.isRequired
};

export default ProductListBredcrumb;
