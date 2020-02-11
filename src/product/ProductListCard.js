import React from 'react';
import PropTypes from 'prop-types';

const fileUrl = process.env.REACT_APP_FILE_URL;

const ProductListCard = ({ productInfo }) => {
  const {
    id,
    product_name,
    productPrice,
    discountAmount,
    home_image
  } = productInfo;
  return (
    <div>
      <div className="product-image7">
        <a href={'/productDetails/' + id}>
          <img
            className="pic-1"
            src={fileUrl + '/upload/product/productImages/' + home_image}
            alt={`img`}
          />
        </a>

        <ul className="socialProductList">
          <li>
            <a href="!#" className="fa fa-heart-o">
              {''}
            </a>
          </li>
          <li className="shoppingCartLi">
            <a href="!#" className="fa fa-shopping-cart">
              {''}
            </a>
          </li>
        </ul>
        <span className="product-new-label">New</span>
        <span className="product-new-label-discount">10%</span>
      </div>
      <div className="product-content">
        <h3 className="title">
          <a href={'/productDetails/' + id}>{product_name}</a>
        </h3>
        <ul className="rating">
          <li className="fa fa-star"></li>
          <li className="fa fa-star"></li>
          <li className="fa fa-star"></li>
          <li className="fa fa-star"></li>
          <li className="fa fa-star"></li>
        </ul>
        <div className="price">
          ৳{productPrice - discountAmount}
          {discountAmount > 0 && <span>৳{productPrice}</span>}
        </div>
      </div>
    </div>
  );
};

ProductListCard.propTypes = {
  productInfo: PropTypes.object.isRequired
};

export default ProductListCard;
