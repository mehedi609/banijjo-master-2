import React, { Component } from 'react';
import Footer from '../include/footer';
import Breadcums from '../include/breadcums';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

const emailPattern = /^(([^<>()[]\.,;:s@"]+(.[^<>()[]\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;

class ShoppingCart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      textArray: [],
      allCategories: [],
      cartProducts: [],
      isAddress: false,
      checkAgreement: false,
      responseMessage: '',
      termsMessage: '',
      itemQuantityState: [],
      customerInfo: [],
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      discountAmount: 0,
      promoCodeAmount: 0,
      discountDetail: [],
      promoCodeDetail: []
    };

    this.payOrder = this.payOrder.bind(this);
    this.paySsl = this.paySsl.bind(this);
    this.addressSubmit = this.addressSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.loadProduct = this.loadProduct.bind(this);
    this.changeAgreement = this.changeAgreement.bind(this);
    this.checkInventory = this.checkInventory.bind(this);
    this.searchPromoCode = this.searchPromoCode.bind(this);
  }
  componentDidMount() {
    this.getCustomerInfo();
    this.getAllCategories();
    this.gettermsConditions();
    this.getCustomerCartProducts();
  }

  getDiscounts(cartProducts) {
    fetch(base + '/api/getDiscounts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cartProducts: cartProducts,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        this.setState({
          discountAmount: response.data,
          discountDetail: response.dataDetail
        });
      });
  }

  gettermsConditions() {
    fetch(base + '/api/get_terms_conditions', {
      method: 'GET'
    })
      .then(res => {
        return res.json();
      })
      .then(termsConditions => {
        this.setState({ termsMessage: termsConditions.data });
        return false;
      });
  }

  getCustomerInfo() {
    fetch(base + '/api/getCustomerInfo', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: localStorage.getItem('customer_id')
          ? localStorage.getItem('customer_id')
          : 0
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data) {
          this.setState({
            customerName: response.data.name,
            customerPhone: response.data.phone_number,
            customerAddress: response.data.address
          });
        }
        return false;
      });
  }

  changeAgreement() {
    if (this.state.checkAgreement === false) {
      this.setState({ checkAgreement: !this.state.checkAgreement }, () => {
        console.log('aaa', this.state);
      });
    } else {
      this.setState({ checkAgreement: !this.state.checkAgreement }, () => {
        console.log('bbb', this.state);
      });
    }
  }

  getUniqueProductsFromCart = (arr, keyProps) => {
    const kvArray = arr.map(entry => {
      const key = keyProps.map(k => entry[k]).join('|');
      return [key, entry];
    });
    const map = new Map(kvArray);
    return Array.from(map.values());
  };

  requiredFunc() {
    let cartData = JSON.parse(localStorage.getItem('cart'));

    let productIds = [];

    if (cartData) {
      cartData.forEach(function(val, index) {
        productIds.push(val.productId);
      });

      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];

      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        cartData.forEach(function(val, key) {
          if (parseInt(valParent) === parseInt(val.productId)) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });

      let revisedCartDataKeyValue = [];
      revisedCartData.forEach(function(value, key) {
        revisedCartDataKeyValue[value.productId] = value.quantity;
      });
      return revisedCartDataKeyValue;
    } else {
      return [];
    }
  }

  getCustomerCartProducts() {
    if (!localStorage.customer_id) {
      let cartData = JSON.parse(localStorage.getItem('cart'));
      let productIds = [];

      if (cartData) {
        cartData.forEach(function(val) {
          productIds.push(val.productId);
        });

        let uniqueProductIds = productIds.filter(
          (v, i, a) => a.indexOf(v) === i
        );
        let revisedCartData = [];

        uniqueProductIds.forEach(function(valParent) {
          let totalCount = 0;
          cartData.forEach(function(val) {
            if (parseInt(valParent) === parseInt(val.productId)) {
              totalCount += val.quantity;
            }
          });
          revisedCartData.push({ productId: valParent, quantity: totalCount });
        });

        let revisedCartDataKeyValue = [];
        revisedCartData.forEach(function(value, key) {
          revisedCartDataKeyValue[value.productId] = value.quantity;
        });

        this.setState({
          revisedCartDataKeyValue: revisedCartDataKeyValue
        });

        fetch(base + '/api/getCustomerCartProducts', {
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
              cartProducts: response.data
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
          revisedCartDataKeyValue: [],
          itemQuantityState: 0,
          cartProducts: []
        });
      }

      this.getDiscounts(cartData);
    } else {
      fetch(base + '/api/getCustomerCartProducts', {
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
            cartProducts: response.data
          });

          this.getDiscounts(response.data);

          // let requiredFunc = this.requiredFunc();
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
      let cartData = JSON.parse(localStorage.getItem('cart'));
      let productIds = [];
      cartData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];
      uniqueProductIds.forEach(function(valParent) {
        let totalCount = 0;
        cartData.forEach(function(val) {
          if (valParent === val.productId) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });
      let newCartData = [];
      revisedCartData.forEach(function(val, key) {
        if (itemId !== val.productId) {
          newCartData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(newCartData));
      this.getCustomerCartProducts();
      window.location = '/cart';
    } else {
      fetch(base + '/api/deleteCustomerCartProducts', {
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
          this.getCustomerCartProducts();
          window.location = '/cart';
        });
    }
  }

  handleClickQuantity(itemId, type) {
    if (!localStorage.customer_id) {
      let cartData = JSON.parse(localStorage.getItem('cart'));
      let productIds = [];
      cartData.forEach(function(val) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];
      uniqueProductIds.forEach(function(valParent) {
        let totalCount = 0;
        cartData.forEach(function(val) {
          if (parseInt(valParent) === parseInt(val.productId)) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });
      let newCartData = [];
      revisedCartData.forEach(function(val, key) {
        if (parseInt(itemId) === parseInt(val.productId)) {
          let newQty = val.quantity;
          if (type === 0) {
            if (val.quantity > 0) {
              newQty -= 1;
            }
          } else {
            newQty += 1;
          }
          newCartData.push({ productId: val.productId, quantity: newQty });
        } else {
          newCartData.push({
            productId: val.productId,
            quantity: val.quantity
          });
        }
      });
      localStorage.removeItem('cart');
      localStorage.setItem('cart', JSON.stringify(newCartData));
      this.getCustomerCartProducts();
    } else {
      fetch(base + '/api/updateCustomerCartProducts', {
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
          this.getCustomerCartProducts();
        });
    }
  }

  payOrder() {
    fetch(base + '/api/payOrder', {
      method: 'POST',
      crossDomain: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: localStorage.customer_id,
        discountAmount: this.state.discountAmount,
        discountDetail: this.state.discountDetail,
        promoCodeAmount: this.state.promoCodeAmount,
        promoCodeDetail: this.state.promoCodeDetail
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log(response);
        if (response.data === true) {
          this.setState({ responseMessage: response.message });
          var link = document.getElementById('successCartMessage');
          var cartModalclose = document.getElementById('cartModalClose');
          var paymentModalClose = document.getElementById('paymentModalClose');
          paymentModalClose.click();
          cartModalclose.click();
          link.click();
        } else if (response.data === false) {
          this.setState({ responseMessage: response.message });
          link = document.getElementById('successCartMessage');
          cartModalclose = document.getElementById('cartModalClose');
          paymentModalClose = document.getElementById('paymentModalClose');
          paymentModalClose.click();
          cartModalclose.click();
          link.click();
        }
      });
  }

  paySsl() {
    fetch(base + '/api/paySsl', {
      method: 'POST',
      crossDomain: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customerId: localStorage.customer_id,
        discountAmount: this.state.discountAmount,
        discountDetail: this.state.discountDetail,
        promoCodeAmount: this.state.promoCodeAmount,
        promoCodeDetail: this.state.promoCodeDetail
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log(response.data);
        window.location.href = response.data;
      });
  }

  getAllCategories() {
    fetch(base + '/api/all_category_list_more', {
      method: 'GET'
    })
      .then(res => {
        return res.json();
      })
      .then(categories => {
        this.setState({ Categories: categories.data });
        return false;
      });
  }

  loadProduct() {
    window.location.href = '/';
  }

  addressSubmit(event) {
    event.preventDefault();

    fetch(base + '/api/saveCustomerAddress', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: this.state.customerName,
        phone_number: this.state.customerPhone,
        address: this.state.customerAddress,
        city: event.target.city.value,
        district: event.target.district.value,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data !== '') {
          this.setState({ isAddress: true });
          let link = document.getElementById('closeAddress');
          link.click();
        }
      });
  }

  customerLoginSubmit(event) {
    event.preventDefault();
    fetch(base + '/api/loginCustomerInitial', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: event.target.emailField.value,
        password: event.target.passwordField.value
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        // console.log('aa', response);
        if (response.data !== '') {
          localStorage.setItem('customer_id', response.data);
          var link = document.getElementById('successCartMessage');
          var hide = document.getElementById('hideLogin');
          hide.click();
          link.click();
        }
      });
  }

  searchPromoCode(event) {
    event.preventDefault();
    let promoCodeInput = event.target.promoCodeText.value;
    let totalAmount = event.target.totalAmount.value;

    fetch(base + '/api/getPromoCodeAmount', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        promoCodeInput: promoCodeInput,
        totalAmount: totalAmount,
        customerId: localStorage.customer_id
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data > 0) {
          this.setState({
            promoCodeAmount: response.data,
            promoCodeDetail: response.dataDetail
          });
        }
        var hidePromoCodeModal = document.getElementById('hidePromoCodeModal');
        hidePromoCodeModal.click();
      });
  }

  createAccountNext(event) {
    event.preventDefault();
    if (event.target.email.value === '' || event.target.email.value == null) {
      this.setState({
        emailError: 'Email cannot be empty'
      });
      return false;
    } else if (
      !emailPattern.test(event.target.email.value) &&
      event.target.email.value > 0
    ) {
      this.setState({
        emailError: 'Enter a valid Password'
      });
      return false;
    } else if (
      event.target.password.value === '' ||
      event.target.password.value == null
    ) {
      this.setState({
        passwordError: 'Password cannot be empty'
      });
      return false;
    } else {
      let cartData = JSON.parse(localStorage.getItem('cart'));
      let productIds = [];
      cartData.forEach(function(val, index) {
        productIds.push(val.productId);
      });
      let uniqueProductIds = productIds.filter((v, i, a) => a.indexOf(v) === i);
      let revisedCartData = [];
      uniqueProductIds.forEach(function(valParent, keyParent) {
        let totalCount = 0;
        cartData.forEach(function(val, key) {
          if (parseInt(valParent) === parseInt(val.productId)) {
            totalCount += val.quantity;
          }
        });
        revisedCartData.push({ productId: valParent, quantity: totalCount });
      });

      fetch(base + '/api/saveCustomerInitial', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
          cartData: revisedCartData
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          if (response.data !== '') {
            localStorage.setItem('customer_id', response.data);
            var hideLogin = document.getElementById('hideLogin');
            var link = document.getElementById('successCartMessage');
            hideLogin.click();
            link.click();
          }
        });
    }
  }

  checkInventory(type) {
    if (this.state.cartProducts.length > 0) {
      fetch(base + '/api/checkInventory', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cartProducts: this.state.cartProducts
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          if (response.data) {
            if (type === 'Order Place') {
              var LoginRegisterModal = document.getElementById(
                'LoginRegisterModalButton'
              );
              var ShippingModal = document.getElementById(
                'ShippingModalButton'
              );
              if (!localStorage.customer_id) {
                LoginRegisterModal.click();
              } else {
                ShippingModal.click();
              }
            } else if (type === 'Order Confirm') {
              var PaymentModalButton = document.getElementById(
                'PaymentModalButton'
              );
              PaymentModalButton.click();
            }
          } else {
            alert(response.message);
          }
        });
    } else {
      alert('Your cart is empty!');
    }
  }

  handleInputChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  promoCodeModalDisplay() {
    var PromoCodeModalButton = document.getElementById('PromoCodeModalButton');
    PromoCodeModalButton.click();
  }

  render() {
    let totalAmount = 0;

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
                  onClick={this.loadProduct}
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
                    ></i>
                  </div>
                  <div className="col-md-11 col-lg-11">
                    <p style={{ color: '#ec1c24' }}>
                      {this.state.responseMessage}.
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1 col-lg-1"></div>
                  <div className="col-md-3 col-lg-3"></div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href={frontEndUrl}
                      className="btn btn-success"
                      style={{
                        backgroundColor: '#ec1c24',
                        borderColor: '#ec1c24'
                      }}
                    >
                      Buy More Product
                    </a>
                  </div>
                </div>
              </div>
              <div className="modal-footer"></div>
            </div>
          </div>
        </div>

        <br />
        <Breadcums />
        <div className="row">
          <div className="medium-8 columns">
            <div className="card shopping-cart">
              <div className="card-header bg-dark text-light">
                <a
                  href={frontEndUrl}
                  style={{ color: '#ec1c24' }}
                  className="btn btn-outline-info btn-sm pull-right"
                >
                  Continue shopping
                </a>
                <div className="clearfix"></div>
              </div>
              <div className="card-body">
                {this.state.cartProducts.length > 0
                  ? this.state.cartProducts.map((item, key) => {
                      if (!localStorage.customer_id) {
                        totalAmount =
                          totalAmount +
                          this.state.revisedCartDataKeyValue[item.id] *
                            item.productPrice;
                      } else {
                        totalAmount =
                          totalAmount + item.quantity * item.productPrice;
                      }

                      return (
                        <React.Fragment>
                          <div className="row">
                            <div className="col-12 col-sm-12 col-md-2 text-center">
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
                            <div className="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
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

                            <div className="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                              <div className="col-9 col-sm-9 col-md-9">
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

                              <div className="col-1 col-sm-1 col-md-1 text-right">
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
                {/* <button id="pos" ref={this.clickDiv} onClick={this.testClick}></button> */}
              </div>
              <div className="card-footer">
                <div className="pull-right" style={{ margin: '10px' }}>
                  <div className="pull-right" style={{ margin: '5px' }}>
                    Total price: <b>{totalAmount}৳</b>
                  </div>
                  <button
                    style={{ display: 'none !important' }}
                    id="LoginRegisterModalButton"
                    type="button"
                    data-toggle="modal"
                    data-target="#LoginRegisterModal"
                  >
                    {''}
                  </button>
                  <button
                    style={{ display: 'none !important' }}
                    id="ShippingModalButton"
                    type="button"
                    data-toggle="modal"
                    data-target="#ShippingModal"
                  >
                    {''}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="medium-4 large-4 columns">
            <div className="panel panel-default">
              <div className="panel-heading text-center">
                <h4>Order Summary</h4>
              </div>
              <div className="panel-body">
                <div className="col-md-12">
                  <strong>
                    Subtotal ({this.state.cartProducts.length} item)
                  </strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>{totalAmount}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong>VAT & Tax</strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>0</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong>Discount</strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>{this.state.discountAmount}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong>
                    Promo Code{' '}
                    <span
                      onClick={this.promoCodeModalDisplay}
                      style={{ cursor: 'pointer' }}
                      className="label label-success"
                    >
                      Apply
                    </span>
                  </strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>{this.state.promoCodeAmount}</span>
                  </div>
                </div>
                <div className="col-md-12">
                  <strong>Shipping</strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>0</span>
                  </div>
                  <hr />
                </div>
                <div className="col-md-12">
                  <strong>Order Total</strong>
                  <div className="pull-right">
                    <span>৳</span>
                    <span>
                      {totalAmount -
                        this.state.discountAmount -
                        this.state.promoCodeAmount}
                    </span>
                  </div>
                  <hr />
                </div>

                <button
                  type="button"
                  onClick={() => this.checkInventory('Order Place')}
                  className="btn btn-primary btn-lg btn-block"
                  style={{ backgroundColor: '#EB1C22', borderColor: '#EB1C22' }}
                >
                  Place Order
                </button>

                <button
                  style={{ display: 'none !important' }}
                  id="PromoCodeModalButton"
                  type="button"
                  data-toggle="modal"
                  data-target="#PromoCodeModal"
                >
                  {''}
                </button>

                <div
                  className="modal"
                  id="PromoCodeModal"
                  tabIndex="-1"
                  role="dialog"
                >
                  <div className="modal-dialog" role="document">
                    <div
                      className="modal-content"
                      style={{ width: '50%', marginLeft: '20%' }}
                    >
                      <div className="modal-header">
                        <button
                          id="hidePromoCodeModal"
                          type="button"
                          className="close"
                          data-dismiss="modal"
                          aria-label="Close"
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                        <div className="frameTopSelection">
                          <span
                            className="helperframeTopSelection"
                            style={{ background: 'white' }}
                          >
                            <img
                              src="/image/banijjoLogo.png"
                              alt="banijjoLogo"
                            />
                          </span>
                        </div>
                      </div>

                      <div className="modal-body">
                        <form
                          className="form-signin"
                          onSubmit={this.searchPromoCode}
                        >
                          <div className="form-label-group">
                            <input
                              type="hidden"
                              name="totalAmount"
                              value={totalAmount}
                            />
                            <input
                              type="text"
                              name="promoCodeText"
                              className="form-control"
                              placeholder="Promo Code"
                              required
                            />
                          </div>

                          <div className="modal-footer">
                            <button
                              type="submit"
                              className="btn btn-danger"
                              style={{ backgroundColor: '#ec1c24' }}
                            >
                              Apply Code
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal"
            id="LoginRegisterModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div
                className="modal-content"
                style={{ width: '50%', marginLeft: '20%' }}
              >
                <div className="modal-header">
                  <button
                    id="hideLogin"
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                </div>
                <ul className="nav nav-tabs">
                  <li className="active" style={{ paddingLeft: '80px' }}>
                    <a data-toggle="tab" href="#registerCart">
                      REGISTER
                    </a>
                  </li>
                  <li style={{ paddingLeft: '30px' }}>
                    <a data-toggle="tab" href="#loginCart">
                      Sign In
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="registerCart" className="tab-pane fade in active">
                    <div className="modal-body">
                      <form
                        className="form-signin"
                        onSubmit={this.createAccountNext}
                      >
                        <div className="form-label-group">
                          <input
                            type="email"
                            id="inputEmail"
                            name="email"
                            className="form-control"
                            placeholder="Email address"
                            required
                          />
                          {this.state.emailError ? (
                            <span style={{ color: 'red' }}>
                              {this.state.emailError}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>

                        <div className="form-label-group">
                          <input
                            type="password"
                            id="inputPassword"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            required
                          />
                          {this.state.passwordError ? (
                            <span style={{ color: 'red' }}>
                              {this.state.passwordError}
                            </span>
                          ) : (
                            ''
                          )}
                        </div>
                        <div className="modal-footer">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ backgroundColor: '#ec1c24' }}
                          >
                            Create Account
                          </button>
                          <p align="left">
                            <a
                              href="!#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Forgot Password?
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div id="loginCart" className="tab-pane fade">
                    <div className="modal-body">
                      <form
                        className="form-signin"
                        onSubmit={this.customerLoginSubmit}
                      >
                        <div className="form-label-group">
                          <input
                            type="email"
                            name="emailField"
                            className="form-control"
                            placeholder="Email "
                            required
                          />
                        </div>
                        <div className="form-label-group">
                          <input
                            type="password"
                            name="passwordField"
                            className="form-control"
                            placeholder="Password"
                            required
                          />
                        </div>
                        <div className="modal-footer">
                          <button
                            type="submit"
                            className="btn btn-danger"
                            style={{ backgroundColor: '#ec1c24' }}
                          >
                            Login
                          </button>
                          <p align="left">
                            <a
                              href="!#"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Forgot Password?
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ marginLeft: '20%', background: 'none' }}
            className="modal"
            id="ShippingModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ width: '450px' }}>
                <div className="modal-header">
                  <button
                    id="cartModalClose"
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                </div>
                <div className="modal-body">
                  <div className="col-md-12">
                    <strong>Total</strong>
                    <div className="pull-right">
                      <i
                        className="fa fa-angle-right"
                        aria-hidden="true"
                        style={{ fontSize: '32px' }}
                      ></i>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <h4>
                      ৳
                      {totalAmount -
                        this.state.discountAmount -
                        this.state.promoCodeAmount}
                    </h4>
                    <div className="pull-right">{''}</div>
                  </div>
                  <p>&nbsp;</p>
                  <div className="col-md-12">
                    <strong>Shipping Information</strong>
                    <div className="pull-right">
                      <i
                        className="fa fa-angle-right"
                        aria-hidden="true"
                        style={{ fontSize: '32px' }}
                      >
                        {''}
                      </i>
                    </div>
                    <br />
                    <button
                      type="button"
                      className="next-btn next-medium next-btn-primary next-btn-text"
                      data-toggle="modal"
                      data-target="#addressModal"
                    >
                      <i className="fa fa-plus" style={{ fontSize: '15px' }}>
                        {''}
                      </i>{' '}
                      Add new address
                    </button>
                  </div>
                  <p>&nbsp;</p>
                  <div className="col-md-12">
                    <input
                      style={{ width: '20px' }}
                      onChange={this.changeAgreement}
                      name="agree"
                      type="checkbox"
                    />
                    <span> Agree terms and conditions</span>
                    <br />
                    <a data-toggle="modal" data-target="#termsModal" href="!#">
                      View terms & conditions
                    </a>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    style={{ display: 'none !important' }}
                    id="PaymentModalButton"
                    type="button"
                    data-toggle="modal"
                    data-target="#exampleModalPayment"
                  >
                    {''}
                  </button>
                  <button
                    onClick={() => this.checkInventory('Order Confirm')}
                    disabled={
                      this.state.customerAddress && this.state.checkAgreement
                        ? false
                        : true
                    }
                    className="btn btn-danger"
                    style={{
                      backgroundColor: '#EB1C22',
                      borderColor: '#EB1C22'
                    }}
                  >
                    {' '}
                    Order Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{ marginLeft: '20%', background: 'none' }}
            className="modal"
            id="termsModal"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div
                className="modal-content"
                style={{ width: '500px', minHeight: '500px' }}
              >
                <div className="modal-header" style={{ textAlign: 'center' }}>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                  Terms and Conditions
                </div>
                <div className="modal-body">{this.state.termsMessage}</div>
              </div>
            </div>
          </div>

          <div
            className="modal"
            id="exampleModalPayment"
            tabIndex="-1"
            role="dialog"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ width: '900px' }}>
                <div className="modal-header">
                  <button
                    id="paymentModalClose"
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                </div>

                <ul className="nav nav-tabs" style={{ marginLeft: '10%' }}>
                  <li className="active" style={{ paddingLeft: '80px' }}>
                    <a data-toggle="tab" href="#cod">
                      Cash on Delivery
                    </a>
                  </li>
                  <li style={{ paddingLeft: '30px' }}>
                    <a data-toggle="tab" href="#ssl">
                      SSLCOMMERZE
                    </a>
                  </li>
                  <li style={{ paddingLeft: '30px' }}>
                    <a data-toggle="tab" href="#dmoney">
                      DMoney
                    </a>
                  </li>
                </ul>

                <div className="tab-content">
                  <div id="cod" className="tab-pane fade in active">
                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-6 col-lg-6">
                          <div
                            className="form-group"
                            style={{ marginLeft: '133px' }}
                          >
                            <label className="control-label">
                              Total Amount :{' '}
                            </label>
                            <span>
                              {' '}
                              ৳
                              {totalAmount -
                                this.state.discountAmount -
                                this.state.promoCodeAmount}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div
                          className="col-md-2 col-lg-2"
                          style={{ marginLeft: '133px' }}
                        >
                          <button
                            onClick={this.payOrder}
                            type="button"
                            className="btn btn-danger"
                            style={{ backgroundColor: '#FF4747' }}
                          >
                            Pay Cash
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer"></div>
                  </div>
                  <div id="ssl" className="tab-pane fade">
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div
                          className="form-group"
                          style={{ marginLeft: '65px' }}
                        >
                          <label className="control-label">
                            Total Amount :{' '}
                          </label>
                          <span>
                            {' '}
                            ৳
                            {totalAmount -
                              this.state.discountAmount -
                              this.state.promoCodeAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-md-2 col-lg-2"
                        style={{ marginLeft: '65px' }}
                      >
                        <button
                          type="button"
                          onClick={this.paySsl}
                          className="btn btn-danger"
                          style={{ backgroundColor: '#FF4747', wicth: '150%' }}
                        >
                          Pay With SSL
                        </button>
                      </div>
                    </div>
                    <div class="modal-footer"></div>
                  </div>
                  <div id="dmoney" class="tab-pane fade">
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div
                          className="form-group"
                          style={{ marginLeft: '75px' }}
                        >
                          <label className="control-label">
                            Total Amount:{' '}
                          </label>
                          <span>
                            {' '}
                            ৳
                            {totalAmount -
                              this.state.discountAmount -
                              this.state.promoCodeAmount}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-md-2 col-lg-2"
                        style={{ marginLeft: '75px' }}
                      >
                        <button
                          type="button"
                          className="btn btn-danger"
                          style={{ backgroundColor: '#FF4747' }}
                        >
                          Pay With DMoney
                        </button>
                      </div>
                    </div>
                    <div class="modal-footer"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal" id="addressModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ width: '900px' }}>
                <div className="modal-header">
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                  <button
                    id="closeAddress"
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
                  <h4>Shipping Information</h4>
                  <form onSubmit={this.addressSubmit}>
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div className="form-group">
                          <label className="control-label">Name</label>
                          <input
                            type="text"
                            onChange={this.handleInputChange}
                            value={this.state.customerName}
                            className="form-control"
                            name="customerName"
                            placeholder="Name"
                          />
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="form-group">
                          <label className="control-label">Phone Number</label>
                          <input
                            type="text"
                            onChange={this.handleInputChange}
                            value={this.state.customerPhone}
                            name="customerPhone"
                            className="form-control"
                            placeholder="Mobile"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div className="form-group">
                          <label className="control-label">District</label>
                          <select className="form-control" name="district">
                            <option value="dhaka">Dhaka</option>
                            <option value="rajshahi">Rajshahi</option>
                            <option value="khulna">Khulna</option>
                            <option value="rangpur">Rangpur</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6 col-lg-6">
                        <div className="form-group">
                          <label className="control-label">City</label>
                          <select className="form-control" name="city">
                            <option value="dhaka">Dhaka</option>
                            <option value="rajshahi">Rajshahi</option>
                            <option value="khulna">Khulna</option>
                            <option value="rangpur">Rangpur</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 col-lg-6">
                        <div className="form-group">
                          <label className="control-label">Address</label>
                          <textarea
                            style={{ height: '100px' }}
                            onChange={this.handleInputChange}
                            name="customerAddress"
                            className="form-control"
                            value={this.state.customerAddress}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-2 col-lg-2">
                        <button
                          type="submit"
                          className="btn btn-danger"
                          style={{ backgroundColor: '#FF4747' }}
                        >
                          save
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
          <div className="modal" id="paymentModal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content" style={{ width: '900px' }}>
                <div className="modal-header">
                  <div className="frameTopSelection">
                    <span
                      className="helperframeTopSelection"
                      style={{ background: 'white' }}
                    >
                      <img src="/image/banijjoLogo.png" alt="banijjoLogo" />
                    </span>
                  </div>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginTop: '-25px;' }}
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>

                <div className="modal-body">
                  <h4>Payment Methods</h4>

                  <div className="row">
                    <div className="col-md-3 col-lg-3">
                      <img src="image/card.png" alt={`img`} />
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <img src="image/card2.png" alt={`img`} />
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <img src="image/card3.png" alt={`img`} />
                    </div>
                    <div className="col-md-3 col-lg-3">
                      <img src="image/card4.png" alt={`img`} />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 col-lg-4">
                      <div className="form-group">
                        <label className="control-label">CARD NUMBER</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="0000 0000 0000 0000"
                        />
                      </div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div className="form-group"></div>
                    </div>

                    <div className="col-md-4 col-lg-4">
                      <div className="form-group">
                        <label className="control-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="000"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">CARD HOLDER</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="NAME HERE"
                        />
                      </div>
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <div className="form-group">
                        <label className="control-label">EXPIRES</label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="MM/YY"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-2 col-lg-2">
                      <button
                        type="button"
                        className="btn btn-danger"
                        style={{ backgroundColor: '#FF4747' }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </React.Fragment>
    );
  }
}
export default ShoppingCart;
