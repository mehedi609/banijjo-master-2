import React, { Component, Fragment } from 'react';
import axios from 'axios';
import Footer from '../include/footer';
import Navbar from '../include/Navbar';
import Categories from '../include/categories';
import ProductListBredcrumb from './productListBredcrumb';
import ProductListCard from './ProductListCard';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
// const fileUrl = process.env.REACT_APP_FILE_URL;

class ProductList extends Component {
  state = {
    categoryId: this.props.match.params.cid,
    // status: this.props.match.params.status,
    productList: []
  };

  componentDidMount() {
    this.getProductListByCategoryId();
  }

  getProductListByCategoryId() {
    axios
      .get(`${base}/api/productListByCat/${this.state.categoryId}`)
      .then(res => this.setState({ productList: res.data }));
  }

  render() {
    const { productList } = this.state;
    return (
      <React.Fragment>
        <div>
          <br />
          <Navbar />

          <div className="row">
            <Categories />
            <div className="medium-9 columns">
              {productList.length > 0 &&
                productList.map(({ breadcrumbs, products }) => (
                  <Fragment>
                    <div className="row">
                      <ProductListBredcrumb bredcrumbs={breadcrumbs} />
                    </div>
                    <div className="row">
                      {products.length > 0 &&
                        products.map(
                          ({
                            id,
                            product_name,
                            productPrice,
                            discountAmount,
                            home_image
                          }) => (
                            <div className="col-md-4 col-sm-6" key={id}>
                              <div className="product-grid7">
                                <ProductListCard
                                  productInfo={{
                                    id,
                                    product_name,
                                    productPrice,
                                    discountAmount,
                                    home_image
                                  }}
                                />
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </Fragment>
                ))}
            </div>
          </div>
          <Footer />
        </div>{' '}
      </React.Fragment>
    );
  }
}
export default ProductList;
