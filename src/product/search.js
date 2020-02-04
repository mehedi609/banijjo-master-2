import React, { Component } from 'react';
import Footer from '../include/footer';
import Breadcums from '../include/breadcums';
import Categories from '../include/categories';
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchKey: this.props.match.params.keyName,
      categoryProductList: []
    };
  }

  componentDidMount() {
    console.log(this.state);
    this.render();
  }
  componentWillMount() {
    this.categoryProductLIst();
  }

  categoryProductLIst() {
    fetch(base + '/api/searchProductList', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchKey: this.state.searchKey
      })
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(products => {
        console.log('cattttt', products);
        this.setState(
          {
            categoryProductList: products.data
          },
          () => {
            console.log('consling prfff', this.state);
          }
        );
      });
  }
  productListDynamic() {
    let listArray = [];
    this.state.categoryProductList.length > 0
      ? this.state.categoryProductList.forEach((item, key) => {
          console.log();
          if (key > 1 && key % 4 === 0) {
            listArray.push(<hr />);
          }
          listArray.push(
            <React.Fragment>
              <div className="col-md-3 col-sm-6">
                <div className="product-grid7">
                  <div className="product-image7">
                    <a href={'/productDetails/' + item.id}>
                      <div
                        className="frameProductImg"
                        style={{ borderBottom: '1px solid #ddd' }}
                      >
                        <span className="helperProductImg">
                          <img
                            className="pic-1"
                            src={
                              fileUrl +
                              '/upload/product/productImages/' +
                              item.home_image
                            }
                            alt={''}
                          />
                          <img
                            className="pic-2"
                            src={
                              fileUrl +
                              '/upload/product/productImages/' +
                              item.home_image
                            }
                            alt={''}
                          />
                        </span>
                      </div>
                    </a>

                    <ul className="social">
                      <li>
                        <a href="!#" className="fa fa-search">
                          {''}
                        </a>
                      </li>
                      <li>
                        <a href="!#" className="fa fa-shopping-bag">
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
                      <a href="!#">{item.product_name}r</a>
                    </h3>
                    <ul className="rating">
                      <li className="fa fa-star">{''}</li>
                      <li className="fa fa-star">{''}</li>
                      <li className="fa fa-star">{''}</li>
                      <li className="fa fa-star">{''}</li>
                      <li className="fa fa-star">{''}</li>
                    </ul>
                    <div className="price">
                      ৳{item.productPrice}
                      <span>৳20.00</span>
                    </div>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })
      : listArray.push(
          <React.Fragment>
            <p style={{ color: '#ec1c24' }}>No Product Found</p>{' '}
          </React.Fragment>
        );

    return listArray;
  }

  render() {
    // let url = 'http://admin.banijjo.com.bd';
    // let counter = 1;
    // let specificationName = '';
    return (
      <React.Fragment>
        <div>
          <br />
          <Breadcums />

          <div className="row">
            <Categories />
            <div className="medium-9 columns">
              <div className="row">
                <h4 style={{ color: '#ec1c24', textAlign: 'center' }}>
                  Search Results for "{this.state.searchKey}"
                </h4>
                <div style={{ height: '10px' }}>{''}</div>
                {this.productListDynamic()}
              </div>
              <hr />
            </div>
          </div>
          <div className="row">{''}</div>
          <Footer />
        </div>
      </React.Fragment>
    );
  }
}
export default Search;
