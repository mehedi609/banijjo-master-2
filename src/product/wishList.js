import React, { Component } from 'react';
import Footer from '../include/footer';
import Breadcums from '../include/breadcums';
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
// import Categories from '../include/categories';
// import Header from '../include/header';

// const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class WishList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      textArray: [],
      allCategories: [],
      wishProducts: [],
      responseMessage: '',
      itemQuantityState: []
    };
    this.loadProduct = this.loadProduct.bind(this);
  }

  componentDidMount() {
    this.getCustomerWishProducts();
  }

  requiredFunc() {
    let wishData = JSON.parse(localStorage.getItem('wish'));
    let productIds = [];

    if (wishData) {
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });

      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];

      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });

      let revisedwishDataKeyValue = [];
      revisedwishData.forEach(function(value, key) {
        revisedwishDataKeyValue[value.productId] = value.quantity;
      });

      return revisedwishDataKeyValue;
    } else {
      return [];
    }
  }

  getCustomerWishProducts() {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem('wish'));
      let productIds = [];
      // let uniqueProductIds = [];

      if (wishData) {
        wishData.forEach(function(val, index) {
          productIds.push(val.productId);
        });

        let uniqueProductIds = productIds.filter(
          (v, i, a) => a.indexOf(v) === i
        );
        let revisedwishData = [];

        uniqueProductIds.forEach(function(valParent, keyParent) {
          let totalCount = 0;
          wishData.forEach(function(val, key) {
            if (valParent === val.productId) {
              totalCount += val.quantity;
            }
          });
          revisedwishData.push({ productId: valParent, quantity: totalCount });
        });

        let revisedwishDataKeyValue = [];
        revisedwishData.forEach(function(value, key) {
          revisedwishDataKeyValue[value.productId] = value.quantity;
        });

        this.setState({
          revisedwishDataKeyValue: revisedwishDataKeyValue
        });

        fetch(base + '/api/getCustomerWishProducts', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            customerId: 0,
            uniqueProductIds: JSON.stringify(uniqueProductIds)
          })
        })
          .then(res => {
            return res.json();
          })
          .then(response => {
            this.setState({
              wishProducts: response.data
            });
            let requiredFunc = this.requiredFunc();
            let itemQuantityState = {};
            response.data.forEach(function(item, key) {
              itemQuantityState[item.id] = requiredFunc[item.id];
            });
            this.setState({ itemQuantityState: itemQuantityState });
          });
      } else {
        this.setState({
          revisedwishDataKeyValue: [],
          wishProducts: [],
          itemQuantityState: 0
        });
      }
    } else {
      fetch(base + '/api/getCustomerWishProducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.setState({
            wishProducts: response.data
          });
          let itemQuantityState = {};
          response.data.forEach(function(item, key) {
            itemQuantityState[item.id] = item.quantity;
          });
          this.setState({ itemQuantityState: itemQuantityState });
        });
    }
  }

  handleClickDelete(itemId) {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem('wish'));
      let productIds = [];
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });
      let newWishData = [];
      revisedwishData.forEach(function(val, key) {
        if (itemId !== val.productId) {
          newWishData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });
      console.log(revisedwishData);
      localStorage.removeItem('wish');
      localStorage.setItem('wish', JSON.stringify(newWishData));
      this.getCustomerWishProducts();
    } else {
      fetch(base + '/api/deleteCustomerWishProducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id,
          itemId: itemId
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.getCustomerWishProducts();
        });
    }
  }

  handleClickQuantity(itemId, type) {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem('wish'));
      let productIds = [];
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });
      let newWishData = [];
      revisedwishData.forEach(function(val, key) {
        if (itemId === val.productId) {
          let newQty = val.quantity;
          if (type === 0) {
            if (val.quantity > 0) {
              newQty -= 1;
            }
          } else {
            newQty += 1;
          }
          newWishData.push({ productId: val.productId, quantity: newQty });
        } else {
          newWishData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });

      localStorage.removeItem('wish');
      localStorage.setItem('wish', JSON.stringify(newWishData));
      this.getCustomerWishProducts();
    } else {
      fetch(base + '/api/updateCustomerWishProducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id,
          itemId: itemId,
          type: type // 0 for decrement, 1 for increment
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.getCustomerWishProducts();
        });
    }
  }

  addCartLocal(itemId, Qty) {
    let cartArr = [{ productId: itemId, quantity: Qty }];
    let wishDataExisting = JSON.parse(localStorage.getItem('cart'));
    localStorage.removeItem('cart');

    if (wishDataExisting) {
      wishDataExisting.push({ productId: itemId, quantity: Qty });
      localStorage.setItem('cart', JSON.stringify(wishDataExisting));
    } else {
      localStorage.setItem('cart', JSON.stringify(cartArr));
    }
    var link = document.getElementById('successCartMessage');
    link.click();
    this.handleClickDelete(itemId);
  }

  addCartDirect(itemId, Qty) {
    fetch(base + '/api/add_cart_direct_from_wish', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: itemId,
        customerId: localStorage.customer_id,
        quantity: Qty
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data === true) {
          var link = document.getElementById('successCartMessage');
          link.click();
        }
      });
    this.handleClickDelete(itemId);
  }

  // eslint-disable-next-line
  handleClickDelete(itemId) {
    if (!localStorage.customer_id) {
      let wishData = JSON.parse(localStorage.getItem('wish'));
      let productIds = [];
      wishData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedwishData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        wishData.forEach(function(val, key) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedwishData.push({ productId: valParent, quantity: totalCount });
      });
      let newWishData = [];
      revisedwishData.forEach(function(val, key) {
        if (itemId !== val.productId) {
          newWishData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });
      // console.log(revisedwishData)
      localStorage.removeItem('wish');
      localStorage.setItem('wish', JSON.stringify(newWishData));
      this.getCustomerWishProducts();
      window.location = '/wish';
    } else {
      fetch(base + '/api/deleteCustomerWishProducts', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: localStorage.customer_id,
          itemId: itemId
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          this.getCustomerWishProducts();
          window.location = '/wish';
        });
    }
  }

  loadProduct() {
    window.location.href = '/';
  }

  render() {
    return (
      <React.Fragment>
        <button
          style={{ display: 'none !important' }}
          id="successCartMessage"
          type="button"
          data-toggle="modal"
          data-target="#exampleModalShipping"
        >
          {''}
        </button>
        <div
          className="modal"
          id="exampleModalShipping"
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content" style={{ width: '900px' }}>
              <div className="modal-header">
                <h5 className="modal-title" style={{ textAlign: 'center' }}>
                  &nbsp;
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{ marginTop: '-25px' }}
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-1 col-lg-1">
                    <i
                      className="fa fa-check"
                      style={{
                        fontSize: '50px',
                        color: 'white',
                        backgroundColor: '#009345',
                        borderRadius: '40px'
                      }}
                    >
                      {''}
                    </i>
                  </div>
                  <div className="col-md-11 col-lg-11">
                    <p style={{ color: '#009345' }}>
                      Nice. A new item has been added to your Shopping Cart.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1 col-lg-1">{''}</div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href="/cart"
                      className="btn btn-success"
                      style={{
                        backgroundColor: '#ec1c24',
                        borderColor: '#ec1c24'
                      }}
                    >
                      View Shopping Cart
                    </a>
                  </div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href={frontEndUrl}
                      className="btn btn-success"
                      style={{
                        backgroundColor: '#ec1c24',
                        borderColor: '#ec1c24'
                      }}
                    >
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer">{''}</div>
            </div>
          </div>
        </div>
        <Breadcums />
        <div className="row">
          <div className="col-md-10 col-md-offset-1">
            <div className="card shopping-cart">
              <div className="card-header bg-dark text-light">
                <a
                  href={frontEndUrl}
                  style={{ color: '#ec1c24' }}
                  className="btn btn-outline-info btn-sm pull-right"
                >
                  Continue shopping
                </a>
                <div className="clearfix">{''}</div>
              </div>
              <div className="card-body">
                {this.state.wishProducts.length > 0
                  ? this.state.wishProducts.map((item, key) => {
                      return (
                        <React.Fragment>
                          <div className="row">
                            <div className="col-md-3 text-center">
                              {item.home_image ? (
                                <img
                                  className="img-responsive"
                                  src={
                                    fileUrl +
                                    '/upload/product/productImages/' +
                                    item.home_image
                                  }
                                  alt="prewiew"
                                  width="120"
                                  height="80"
                                />
                              ) : (
                                <img
                                  className="img-responsive"
                                  src="http://placehold.it/120x80"
                                  alt="prewiew"
                                  width="120"
                                  height="80"
                                />
                              )}
                            </div>

                            <div className="col-md-3">
                              <h5 className="product-name">
                                <strong>{item.product_name}</strong>
                              </h5>
                              <strong style={{ fontSize: '12px' }}>
                                <b>Color:</b>Black Tshirt
                              </strong>
                              &nbsp;&nbsp;&nbsp;
                              <strong style={{ fontSize: '12px' }}>
                                <b>Model:</b>M
                              </strong>
                              <h6>
                                <b>৳{item.productPrice}</b>
                              </h6>
                            </div>

                            <div className="col-md-6 row">
                              <div className="col-md-6">
                                <div className="quantity">
                                  <div className="quantity-select">
                                    <div
                                      onClick={() =>
                                        this.handleClickQuantity(item.id, 0)
                                      }
                                      className="entry value-minus1"
                                    >
                                      &nbsp;
                                    </div>
                                    <div className="entry value1">
                                      <span>
                                        {this.state.itemQuantityState[item.id]}
                                      </span>
                                    </div>
                                    <div
                                      onClick={() =>
                                        this.handleClickQuantity(item.id, 1)
                                      }
                                      className="entry value-plus1 active"
                                    >
                                      &nbsp;
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-md-6 text-right">
                                {!localStorage.customer_id ? (
                                  <button
                                    onClick={() =>
                                      this.addCartLocal(
                                        item.id,
                                        this.state.itemQuantityState[item.id]
                                      )
                                    }
                                    style={{ backgroundColor: '009345' }}
                                    className="btn btn-primary"
                                  >
                                    Add to cart
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      this.addCartDirect(
                                        item.id,
                                        this.state.itemQuantityState[item.id]
                                      )
                                    }
                                    style={{ backgroundColor: '009345' }}
                                    className="btn btn-primary"
                                  >
                                    Add to cart
                                  </button>
                                )}
                                <button
                                  onClick={() =>
                                    this.handleClickDelete(item.id)
                                  }
                                  type="button"
                                  className="btn btn-outline-danger btn-xs"
                                >
                                  <i
                                    className="fa fa-trash"
                                    aria-hidden="true"
                                    style={{ fontSize: '24px', color: 'red' }}
                                  >
                                    {''}
                                  </i>
                                </button>
                              </div>
                            </div>
                          </div>
                          <hr />
                        </React.Fragment>
                      );
                    })
                  : ''}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
export default WishList;
