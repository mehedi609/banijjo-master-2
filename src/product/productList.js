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
  /*constructor(props) {
    super(props);
    this.state = {
      categoryId: this.props.match.params.cid,
      status: this.props.match.params.status,
      categoryProductList: []
    };
  }*/

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

  // categoryProductLIst() {
  //   if (this.state.status === 'multiple') {
  //     fetch(base + '/api/all_category_product_list', {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //       .then(res => {
  //         console.log(res);
  //         return res.json();
  //       })
  //       .then(products => {
  //         this.setState({
  //           categoryProductList: products.data
  //         });
  //       });
  //   } else {
  //     //  CATEGORY WISE PRODUCTS.......... CREATED AT 12/17/2019
  //     fetch(base + `/api/category_product_list/${this.state.categoryId}`, {
  //       method: 'GET',
  //       headers: {
  //         Accept: 'application/json',
  //         'Content-Type': 'application/json'
  //       }
  //     })
  //       .then(res => {
  //         return res.json();
  //       })
  //       .then(products => {
  //         this.setState({
  //           categoryProductList: products.data
  //         });
  //       });
  //   }
  // }

  // productListDynamic() {
  //   let listArray = [];
  //   this.state.categoryProductList.length > 0
  //     ? this.state.categoryProductList.map((item, key) => {
  //         listArray.push(
  //           <React.Fragment>
  //             <div className="col-md-3 col-sm-6">
  //               <div className="product-grid7">
  //                 <div className="product-image7">
  //                   <a href={'/productDetails/' + item.id}>
  //                     <div className="frameProductImg">
  //                       <span className="helperProductImg">
  //                         <img
  //                           className="pic-1"
  //                           src={
  //                             fileUrl +
  //                             '/upload/product/productImages/' +
  //                             item.home_image
  //                           }
  //                         />
  //                       </span>
  //                     </div>
  //                   </a>
  //
  //                   <ul className="socialProductList">
  //                     <li>
  //                       <a href="" className="fa fa-heart-o"></a>
  //                     </li>
  //                     <li>
  //                       <a href="" className="fa fa-shopping-cart"></a>
  //                     </li>
  //                   </ul>
  //                   <span className="product-new-label">New</span>
  //                   <span className="product-new-label-discount">10%</span>
  //                 </div>
  //                 <div className="product-content">
  //                   <h3 className="title">
  //                     <a href="#">{item.product_name}r</a>
  //                   </h3>
  //                   <ul className="rating">
  //                     <li className="fa fa-star"></li>
  //                     <li className="fa fa-star"></li>
  //                     <li className="fa fa-star"></li>
  //                     <li className="fa fa-star"></li>
  //                     <li className="fa fa-star"></li>
  //                   </ul>
  //                   <div className="price">
  //                     ৳{item.productPrice}
  //                     <span>৳20.00</span>
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </React.Fragment>
  //         );
  //       })
  //     : listArray.push(
  //         <React.Fragment>
  //           <p style={{ color: '#ec1c24' }}>No product for this category</p>{' '}
  //         </React.Fragment>
  //       );
  //
  //   return listArray;
  // }

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
                            <div className="col-md-3 col-sm-6" key={id}>
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
