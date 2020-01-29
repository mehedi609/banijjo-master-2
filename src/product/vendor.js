import React, { Component } from 'react';
import Breadcums from '../include/breadcums';
import Footer from '../include/footer';

const fileUrl = process.env.REACT_APP_FILE_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

class Vendor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      VendorId: this.props.match.params.id,
      VendorName: '',
      VendorLogo: '',
      VendorCover: '',
      VendorCategories: [],
      CategoryIds: [],
      ClickedCategory: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.showAll = this.showAll.bind(this);
  }

  componentDidMount() {
    this.getVendorData();
    this.getVendorCategories();
  }

  config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  /*getVendorData() {
    const body = JSON.stringify({
      vendorId: this.state.VendorId
    });

    axios
      .post(`${base}/api/getVendorData`, body, this.config)
      .then(response => {
        const { name, logo, cover_photo } = response.data.data;
        this.setState({
          VendorName: name,
          VendorLogo: logo,
          VendorCover: cover_photo
        });
      })
      .catch(e => console.log(e));
  }

  getVendorCategories() {
    const body = JSON.stringify({
      vendorId: this.state.VendorId
    });

    axios
      .post(`${base}/api/getVendorCategories`, body, this.config)
      .then(response => {
        this.setState({ VendorCategories: response.data.data });

        let CategoryList = [];
        let CategoryIdArr = [];
        let CategoryKeyValue = [];

        this.state.VendorCategories.map(function(item, key) {
          CategoryList.push(
            <option value={item.category_id}>{item.category_name}</option>
          );
          CategoryIdArr.push(item.category_id);
          CategoryKeyValue[item.category_id] = item.category_name;
        });
        this.setState({
          CategoryList: CategoryList,
          CategoryIds: CategoryIdArr,
          CategoryKeyValue: CategoryKeyValue
        });
        this.getProducts(CategoryIdArr);
      })
      .catch(e => console.log(e));
  }*/

  getVendorData() {
    fetch(`${base}/api/getVendorData`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendorId: this.state.VendorId,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data) {
          const { name, logo, cover_photo } = response.data;
          this.setState({
            VendorName: name,
            VendorLogo: logo,
            VendorCover: cover_photo,
          });
        }
      });
  }

  getVendorCategories() {
    fetch(`${base}/api/getVendorCategories`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendorId: this.state.VendorId,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data) {
          this.setState({ VendorCategories: response.data });
          let CategoryList = [];
          let CategoryIdArr = [];
          let CategoryKeyValue = [];
          this.state.VendorCategories.map(function(item, key) {
            CategoryList.push(
              <option value={item.category_id}>{item.category_name}</option>,
            );
            CategoryIdArr.push(item.category_id);
            CategoryKeyValue[item.category_id] = item.category_name;
          });
          this.setState({
            CategoryList: CategoryList,
            CategoryIds: CategoryIdArr,
            CategoryKeyValue: CategoryKeyValue,
          });
          this.getProducts(CategoryIdArr);
        }
      });
  }

  handleClick(event) {
    let Cat = event.target.value;
    if (Cat === 0) {
      this.getVendorCategories();
    } else {
      let CategoryIdArr = [];
      CategoryIdArr.push(Cat);
      this.getProducts(CategoryIdArr);
    }
  }

  getProducts(CategoryIdArr) {
    fetch(base + '/api/getVendorProductsByCategory', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendorId: this.state.VendorId,
        categoryIds: CategoryIdArr,
      }),
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data) {
          var RevisedArr = {};
          for (var i = 0; i < response.data.length; i++) {
            let category_id = response.data[i].category_id;
            if (!RevisedArr[category_id]) {
              RevisedArr[category_id] = [];
            }
            RevisedArr[category_id].push(response.data[i]);
          }

          let ProductJSX = [];
          let CategoryKeyValue = this.state.CategoryKeyValue;

          Object.keys(RevisedArr).length > 0
            ? Object.keys(RevisedArr).map(function(key, index) {
                ProductJSX.push(
                  <h3 style={{ clear: 'both', marginTop: '2%' }} className="h3">
                    {CategoryKeyValue[key]}
                  </h3>,
                );
                let IterationArr = RevisedArr[key];
                for (var i = 0; i < IterationArr.length; i++) {
                  if (Object.keys(RevisedArr).length !== 1 && i === 8) {
                    break;
                  }
                  ProductJSX.push(
                    <div className="col-md-3 col-sm-6">
                      <div className="product-grid7">
                        <div className="product-image7">
                          <a href={'/productDetails/' + IterationArr[i].id}>
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
                                    IterationArr[i].home_image
                                  }
                                />
                              </span>
                            </div>
                          </a>
                          <ul className="socialProductList">
                            <li>
                              <a
                                id={IterationArr[i].id}
                                onClick={event => {
                                  if (!localStorage.customer_id) {
                                    let wishArr = [
                                      {
                                        productId: event.target.id,
                                        quantity: 1,
                                      },
                                    ];
                                    let wishDataExisting = JSON.parse(
                                      localStorage.getItem('wish'),
                                    );
                                    localStorage.removeItem('wish');
                                    if (wishDataExisting) {
                                      wishDataExisting.push({
                                        productId: event.target.id,
                                        quantity: 1,
                                      });
                                      localStorage.setItem(
                                        'wish',
                                        JSON.stringify(wishDataExisting),
                                      );
                                    } else {
                                      localStorage.setItem(
                                        'wish',
                                        JSON.stringify(wishArr),
                                      );
                                    }
                                    alert('Product Added To Wish List!');
                                  } else {
                                    fetch(base + '/api/add_wish_direct', {
                                      method: 'POST',
                                      headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        productId: event.target.id,
                                        customerId: localStorage.customer_id,
                                        quantity: 1,
                                      }),
                                    })
                                      .then(res => {
                                        return res.json();
                                      })
                                      .then(response => {
                                        if (response.data == true) {
                                          alert('Product Added To Wish List!');
                                        }
                                      });
                                  }
                                }}
                                className="fa fa-heart-o"
                              ></a>
                            </li>
                            <li>
                              <a
                                id={IterationArr[i].id}
                                onClick={event => {
                                  if (!localStorage.customer_id) {
                                    let cartArr = [
                                      {
                                        productId: event.target.id,
                                        quantity: 1,
                                      },
                                    ];
                                    let cartDataExisting = JSON.parse(
                                      localStorage.getItem('cart'),
                                    );
                                    localStorage.removeItem('cart');

                                    if (cartDataExisting) {
                                      cartDataExisting.push({
                                        productId: event.target.id,
                                        quantity: 1,
                                      });
                                      localStorage.setItem(
                                        'cart',
                                        JSON.stringify(cartDataExisting),
                                      );
                                    } else {
                                      localStorage.setItem(
                                        'cart',
                                        JSON.stringify(cartArr),
                                      );
                                    }
                                    alert('Product Added To Cart!');
                                  } else {
                                    fetch(base + '/api/add_cart_direct', {
                                      method: 'POST',
                                      headers: {
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json',
                                      },
                                      body: JSON.stringify({
                                        productId: event.target.id,
                                        customerId: localStorage.customer_id,
                                        quantity: 1,
                                      }),
                                    })
                                      .then(res => {
                                        return res.json();
                                      })
                                      .then(response => {
                                        if (response.data == true) {
                                          alert('Product Added To Cart!');
                                        }
                                      });
                                  }
                                }}
                                className="fa fa-shopping-cart"
                              ></a>
                            </li>
                          </ul>
                          <span className="product-new-label">New</span>
                          <span className="product-new-label-discount">0%</span>
                        </div>

                        <div className="product-content">
                          <h3 className="title">
                            <a href="#">{IterationArr[i].product_name}</a>
                          </h3>
                          <ul className="rating">
                            <li className="fa fa-star"></li>
                            <li className="fa fa-star"></li>
                            <li className="fa fa-star"></li>
                            <li className="fa fa-star"></li>
                            <li className="fa fa-star"></li>
                          </ul>
                          <div className="price">
                            ${IterationArr[i].productPrice}
                            {/* <span>$20.00</span> */}
                          </div>
                        </div>
                      </div>
                    </div>,
                  );
                }

                if (IterationArr.length > 8) {
                  ProductJSX.push(
                    <p
                      onClick={() => this.showAll(key)}
                      style={{
                        clear: 'both',
                        marginTop: '2%',
                        color: 'green',
                        textAlign: 'right',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                      className="p"
                    >
                      See More
                    </p>,
                  );
                }
              }, this)
            : ProductJSX.push(
                <h5
                  style={{
                    clear: 'both',
                    marginTop: '2%',
                    color: 'red',
                    textAlign: 'center',
                  }}
                  className="h5"
                >
                  No Product To Display
                </h5>,
              );
          this.setState({ ProductJSX: ProductJSX });
        }
      });
  }

  showAll(Cat) {
    let CategoryIdArr = [];
    CategoryIdArr.push(Cat);
    this.getProducts(CategoryIdArr);
  }

  render() {
    return (
      <div>
        <br />
        <Breadcums />

        <div className="row vendorMobileHeader">
          <div className="columns small-6 large-2 vendorLogoHeaderMobile">
            <p style={{ textAlign: 'left' }}>
              {!this.state.VendorLogo ? (
                <img
                  src={fileUrl + '/upload/product/productImages/asche.jpg'}
                  className="imglogo"
                  alt="Vendor logo"
                />
              ) : (
                <img
                  src={fileUrl + '/upload/vendor/' + this.state.VendorLogo}
                  className="imglogo"
                  alt="Vendor logo"
                />
              )}
            </p>
          </div>
          <div className="columns small-6 large-10">
            <h6 style={{ marginTop: '45px' }}>{this.state.VendorName}</h6>
          </div>
        </div>

        <div className="row">
          <div className="columns large-4 vendorLogoHeader">
            <p style={{ textAlign: 'left' }}>
              {!this.state.VendorLogo ? (
                <img
                  style={{ width: '150px', height: '150px' }}
                  src={fileUrl + '/upload/product/productImages/asche.jpg'}
                  className="imglogo"
                  alt="Vendor logo"
                />
              ) : (
                <img
                  style={{ width: '150px', height: '150px' }}
                  src={fileUrl + '/upload/vendor/' + this.state.VendorLogo}
                  className="imglogo"
                  alt="Vendor logo"
                />
              )}
            </p>
          </div>
          <div className="columns large-5 vendorNameHeader">
            <h1 style={{ marginTop: '45px' }}>{this.state.VendorName}</h1>
          </div>
          <div className="columns large-3">
            <p className="vendorSearchHeader">
              <select
                style={{ border: '1px solid green' }}
                className="form-control"
                onChange={this.handleClick}
              >
                <option value="0">All Categories</option>
                {this.state.CategoryList}
              </select>
            </p>
          </div>
        </div>

        <div className="row" style={{ marginTop: '2%' }}>
          <div className="columns large-12">
            {!this.state.VendorCover ? (
              <img
                className="vendorCoverImage"
                src={fileUrl + '/upload/vendor/cover1.jpg'}
                alt="Snow"
              />
            ) : (
              <img
                className="vendorCoverImage"
                src={fileUrl + '/upload/vendor/' + this.state.VendorCover}
                alt="Snow"
              />
            )}
          </div>
        </div>

        <div className="row">
          <div className="medium-12 columns">{this.state.ProductJSX}</div>
          <hr />
        </div>

        <Footer />
      </div>
    );
  }
}

export default Vendor;
