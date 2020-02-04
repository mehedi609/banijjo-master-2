import React, { useEffect, useState } from 'react';
import Footer from '../include/footer';
import Navbar from '../include/Navbar';
import Categories from '../include/categories';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

const FeatureProductsList = ({ match }) => {
  const [featuredProductsList, setFeaturedProductsList] = useState([]);

  const renderProductsList = () =>
    featuredProductsList.map(item => (
      <div className="col-md-3 col-sm-6" key={item.id}>
        <div className="product-grid7">
          <div className="product-image7">
            <a href={'/productDetails/' + item.id}>
              <div className="frameProductImg">
                <span className="helperProductImg">
                  <img
                    className="pic-1"
                    src={
                      fileUrl +
                      '/upload/product/productImages/' +
                      item.home_image
                    }
                    alt={`img`}
                  />
                  <img
                    className="pic-2"
                    src={
                      fileUrl +
                      '/upload/product/productImages/' +
                      item.home_image
                    }
                    alt={`img`}
                  />
                </span>
              </div>
            </a>

            <ul className="socialProductList">
              <li>
                <a href="!#" className="fa fa-heart-o">
                  {''}
                </a>
              </li>
              <li>
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
              <a href={'/productDetails/' + item.id}>{item.product_name}r</a>
            </h3>
            <ul className="rating">
              <li className="fa fa-star"></li>
              <li className="fa fa-star"></li>
              <li className="fa fa-star"></li>
              <li className="fa fa-star"></li>
              <li className="fa fa-star"></li>
            </ul>
            <div className="price">
              ৳{item.productPrice}
              <span>৳20.00</span>
            </div>
          </div>
        </div>
      </div>
    ));

  useEffect(() => {
    fetch(`${base}/api/featureproducts/${match.params.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        return res.json();
      })
      .then(data => setFeaturedProductsList([...data]));
  }, [match.params.id]);

  return (
    <div>
      <br />
      <Navbar />
      <div className="row">
        <Categories />
        <div className="medium-9 columns">{renderProductsList()}</div>
      </div>
      <div className="row"></div>
      <Footer />
    </div>
  );
};

export default FeatureProductsList;
