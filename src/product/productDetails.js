import React, { Component, Fragment } from 'react';
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterShareButton,
  TwitterIcon,
  PinterestShareButton,
  PinterestIcon,
  LinkedinShareButton,
  LinkedinIcon
} from 'react-share';
import { Helmet } from 'react-helmet';

import Footer from '../include/footer';
import Navbar from '../include/Navbar';
import axios from 'axios';
import $ from 'jquery';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import swal from 'sweetalert';
import '../assets/social-share.css';
import './../assets/selectImage.css';
import ListingSameVendorsSameProducts from './ListingSameVendorsSameProducts';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;

// eslint-disable-next-line
const emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

window.jQuery = window.$ = $;

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category_id: '',
      vendor_id: '',
      showClickedImage: '',
      carouselImages: [],
      productQuantity: 1,
      productName: '',
      productImage: '',
      product_full_description: [],
      product_sku: '',
      product_specification_details: [],
      product_specification_details_description: [],
      product_specification_name: [],
      qc_status: '',
      price: 0,
      reload: false,
      productImages: [],
      homeImage: '',
      productListSmVendor: [],
      productListSmCategory: [],
      email: '',
      password: '',
      emailError: '',
      passwordError: '',
      cartArr: [],
      color: '',
      discountAmount: 0,
      metaTags: [],
      colors: [],
      sizes: [],
      productId: this.props.match.params.id,
      selectedSizeId: '',
      selectedColorId: '',
      selectedColorName: '',
      selectedProductStockAmount: 0,
      isSelectedProduceFound: true,
      onlyColor: false,
      onlySize: false,
      noColorAndSize: false,
      colorAndSize: false
    };

    // this.handleClickPlus = this.handleClickPlus.bind(this);
    // this.handleClickMinus = this.handleClickMinus.bind(this);
    this.addWishDirect = this.addWishDirect.bind(this);
    this.addWishLocal = this.addWishLocal.bind(this);
    this.createAccountNext = this.createAccountNext.bind(this);
    this.customerLoginSubmit = this.customerLoginSubmit.bind(this);
  }

  componentDidMount() {
    this.getProductDetails();
    this.getDiscountAmount();
  }

  getDiscountAmount() {
    axios
      .get(`${base}/api/getDiscountByProductId/${this.state.productId}`)
      .then(res => {
        this.setState({ discountAmount: res.data.discountAmount });
      });
  }

  getProductDetails() {
    axios
      .get(`${base}/api/productDetails/${this.state.productId}`)
      .then(res => {
        const {
          product_name,
          productPrice,
          home_image,
          category_id,
          vendor_id,
          metaTags,
          colors,
          sizes,
          carouselImages,
          productSmVendor,
          productSmCategory,
          description,
          qc_status,
          product_sku
        } = res.data;

        this.setState({
          category_id,
          vendor_id,
          productName: product_name,
          homeImage: !!home_image ? home_image : 'default.png',
          showClickedImage: !!home_image ? home_image : 'default.png',
          product_full_description: description,
          carouselImages: !!carouselImages && carouselImages,
          qc_status: !!qc_status && qc_status,
          product_sku: !!product_sku && product_sku,
          productPrice: !!productPrice && productPrice,
          metaTags: !!metaTags && metaTags,
          productListSmCategory: productSmCategory,
          productListSmVendor: productSmVendor,
          colors,
          sizes,
          onlyColor: colors.length > 0 && sizes.length === 0,
          onlySize: sizes.length > 0 && colors.length === 0,
          noColorAndSize: colors.length === 0 && sizes.length === 0,
          colorAndSize: colors.length > 0 && sizes.length > 0
        });

        setTimeout(() => {
          window.imageZoom(
            'myimage',
            'myresult',
            fileUrl +
              '/upload/product/productImages/' +
              this.state.showClickedImage
          );
        }, 600);
      });
  }

  handleClickMinus = () => {
    this.setState(prevState => ({
      productQuantity:
        prevState.productQuantity > 1
          ? prevState.productQuantity - 1
          : prevState.productQuantity
    }));
  };

  handleClickPlus = () => {
    this.setState(prevState => ({
      productQuantity:
        prevState.productQuantity < 5
          ? prevState.productQuantity + 1
          : prevState.productQuantity
    }));
  };

  couraselImages() {
    if (this.state.productImages) {
      if (this.state.carouselImages.length === 0) {
        this.state.productImages.forEach(item => {
          this.state.carouselImages.push(
            <React.Fragment>
              {/*eslint-disable-next-line*/}
              <a
                style={{ cursor: 'pointer' }}
                data-imageSource={item.imageName}
                onClick={() => {
                  this.setState({ showClickedImage: item.imageName });
                  window.imageZoom(
                    'myimage',
                    'myresult',
                    fileUrl + '/upload/product/productImages/' + item.imageName
                  );
                }}
              >
                <div className="frameZoomSlider">
                  <span className="helperZoomSlider">
                    <img
                      src={
                        fileUrl +
                        '/upload/product/productImages/' +
                        item.imageName
                      }
                      alt={''}
                    />
                  </span>
                </div>
              </a>
            </React.Fragment>
          );
        });
      }
    }
    return this.state.carouselImages;
  }

  showCarouselSlider() {
    return this.state.carouselImages.map(({ imageName, serialNumber }) => (
      <React.Fragment>
        <a
          href={`!#`}
          onClick={() => {
            this.setState({ showClickedImage: imageName });
            window.imageZoom(
              'myimage',
              'myresult',
              fileUrl + '/upload/product/productImages/' + imageName
            );
          }}
        >
          <div className="frameZoomSlider">
            <span className="helperZoomSlider">
              <img
                src={fileUrl + '/upload/product/productImages/' + imageName}
                alt={''}
              />
            </span>
          </div>
        </a>
      </React.Fragment>
    ));
  }

  productDescriptions() {
    let descriptionText = [];
    if (this.state.product_full_description.length > 0) {
      this.state.product_full_description.forEach((item, key) => {
        descriptionText.push(
          <React.Fragment key={key}>
            <h3>{item.title}</h3>
            {item.descriptionImage ? (
              <img
                src={
                  fileUrl +
                  '/upload/product/productDescriptionImages/' +
                  item.descriptionImage
                }
                alt={''}
              />
            ) : (
              ''
            )}

            <p>{item.description}</p>
          </React.Fragment>
        );
      });
    } else {
      descriptionText.push(
        <p style={{ color: '#ec1c24' }}>No Descriptions Added</p>
      );
    }
    return descriptionText;
  }

  specificationDetailsPart() {
    const spcArray = [];
    if (this.state.product_specification_name.length > 1) {
      this.state.product_specification_name.forEach((item, key) => {
        if (key === 1) {
          spcArray.push(<h5>{item.specificationName.toUpperCase()} :</h5>);
          this.state.product_specification_name.forEach((item1, key1) => {
            if (item.specificationName === item1.specificationName) {
              spcArray.push(
                <div className="colr ert">
                  <div className="check">
                    <label className="checkbox">
                      <input type="checkbox" name="checkbox" checked="" />
                      <i> </i>
                      {item1.specificationNameValue}
                    </label>
                  </div>
                </div>
              );
            }
          });
          spcArray.push(<div className="clearfix"> </div>);
        }
      });
    }
    return spcArray;
  }

  isSelectedProductExists = () => {
    const { productId, selectedSizeId, selectedColorId } = this.state;

    const data = {
      productId,
      colorId: selectedColorId === '' ? 0 : selectedColorId,
      sizeId: selectedSizeId === '' ? 0 : selectedSizeId
    };

    const config = {
      headers: { 'Content-Type': 'application/json' }
    };

    const body = JSON.stringify(data);

    axios
      .post(`${base}/api/getNetProductsFromStock`, body, config)
      .then(res => {
        const { net_products } = res.data;
        this.setState({ selectedProductStockAmount: net_products });
      });
  };

  addCartLocal = e => {
    let flag = true;

    if (this.state.onlyColor) {
      if (this.state.selectedColorId === '') {
        this.showAlert('Please Select a Color');
        flag = false;
      } else {
        this.isSelectedProductExists();
      }
    } else if (this.state.onlySize) {
      if (this.state.selectedSizeId === '') {
        this.showAlert('Please Select a Size');
        flag = false;
      } else {
        this.isSelectedProductExists();
      }
    } else if (!this.state.noColorAndSize) {
      if (this.state.selectedColorId === '') {
        this.showAlert('Please Select a Color');
        flag = false;
      }
      if (this.state.selectedSizeId === '') {
        this.showAlert('Please Select a Size');
        flag = false;
      } else {
        this.isSelectedProductExists();
      }
    } else if (!this.state.noColorAndSize) this.isSelectedProductExists();

    setTimeout(() => {
      const {
        productId,
        selectedSizeId,
        selectedColorId,
        selectedProductStockAmount,
        productQuantity
      } = this.state;

      if (flag) {
        if (productQuantity > selectedProductStockAmount)
          this.showAlert('Product is Out of Stock!');
        else {
          let cartArr = [
            {
              productId: this.state.productId,
              quantity: this.state.productQuantity,
              colorId: selectedColorId === '' ? 0 : selectedColorId,
              sizeId: selectedSizeId === '' ? 0 : selectedSizeId
            }
          ];
          let cartDataExisting = JSON.parse(localStorage.getItem('cart'));
          localStorage.removeItem('cart');

          if (cartDataExisting) {
            cartDataExisting.push({
              productId: this.state.productId,
              quantity: this.state.productQuantity
            });
            localStorage.setItem('cart', JSON.stringify(cartDataExisting));
          } else {
            localStorage.setItem('cart', JSON.stringify(cartArr));
          }
          var link = document.getElementById('successCartMessage');
          link.click();
        }
      }
    }, 100);
  };

  addCartDirect = data => e => {
    fetch(base + '/api/add_cart_direct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: this.state.productId,
        customerId: localStorage.customer_id,
        quantity: this.state.productQuantity
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
  };

  addWishLocal() {
    let wishArr = [
      { productId: this.state.productId, quantity: this.state.productQuantity }
    ];
    let wishDataExisting = JSON.parse(localStorage.getItem('wish'));
    localStorage.removeItem('wish');
    if (wishDataExisting) {
      wishDataExisting.push({
        productId: this.state.productId,
        quantity: this.state.productQuantity
      });
      localStorage.setItem('wish', JSON.stringify(wishDataExisting));
    } else {
      localStorage.setItem('wish', JSON.stringify(wishArr));
    }
    var link = document.getElementById('WishListModalButton');
    link.click();
  }

  addWishDirect() {
    fetch(base + '/api/add_wish_direct', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        productId: this.state.productId,
        customerId: localStorage.customer_id,
        quantity: this.state.productQuantity
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data === true) {
          var link = document.getElementById('WishListModalButton');
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
        password: event.target.passwordField.value,
        productId: this.state.productId,
        quantity: this.state.productQuantity
      })
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        console.log('aa', response);
        if (response.data !== '') {
          localStorage.setItem('customer_id', response.data);
          var link = document.getElementById('successCartMessage');
          var hide = document.getElementById('hideLogin');
          hide.click();
          link.click();
        }
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
      fetch(base + '/api/saveCustomerInitial', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: event.target.email.value,
          password: event.target.password.value,
          productId: this.state.productId,
          quantity: this.state.productQuantity
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

  selectSizeHandler = e => {
    this.setState({ selectedSizeId: e.target.value });
  };

  selectColorHandler = e => {
    this.setState({
      selectedColorId: e.target.id,
      selectedColorName: e.target.name
    });
  };

  showAlert(text) {
    swal({
      title: 'Warning!',
      text,
      icon: 'warning',
      timer: 4000,
      button: false
    });
  }

  render() {
    const options = {
      items: 3,
      slideBy: 1
    };
    const {
      productId,
      productName,
      metaTags,
      carouselImages,
      colors,
      productListSmCategory,
      productListSmVendor,
      category_id,
      vendor_id,
      sizes,
      selectedSizeId,
      selectedColorName
    } = this.state;
    let counter = 1;
    const shareUrl = `http://banijjo.com.bd/productDetails/${productId}`;
    // const title = productName;

    return (
      <React.Fragment>
        <Helmet>
          <meta
            name="viewport"
            content="user-scalable=no, width=device-width, initial-scale=1.0"
          />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          {metaTags &&
            metaTags.map(tags => <meta name="description" content={tags} />)}
          {carouselImages &&
            carouselImages.map(({ imageName }) => (
              <meta name="description" content={imageName} />
            ))}

          <script>
            {`
            var scrollEventHandler = function()
            {window.scroll(0, window.pageYOffset)}
            window.addEventListener("scroll", scrollEventHandler, false);
            `}
          </script>
        </Helmet>

        <div>
          <ul className="ct-socials">
            <li>
              <div className="ct-socials-icon">
                <TwitterShareButton url={shareUrl} quote={productName}>
                  <TwitterIcon size={35} round />
                </TwitterShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <FacebookShareButton url={shareUrl} quote={productName}>
                  <FacebookIcon size={35} round />
                </FacebookShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <PinterestShareButton url={String(window.location)}>
                  <PinterestIcon size={35} round />
                </PinterestShareButton>
              </div>
            </li>
            <li>
              <div className="ct-socials-icon">
                <LinkedinShareButton url={shareUrl} quote={productName}>
                  <LinkedinIcon size={35} round />
                </LinkedinShareButton>
              </div>
            </li>
          </ul>
        </div>

        <button
          style={{ display: 'none !important' }}
          id="successCartMessage"
          type="button"
          data-toggle="modal"
          data-target="#exampleModalShipping"
        >
          {''}
        </button>

        <button
          style={{ display: 'none !important' }}
          id="WishListModalButton"
          type="button"
          data-toggle="modal"
          data-target="#WishListModal"
        >
          {''}
        </button>
        <div
          className="modal"
          id="exampleModalShipping"
          tabIndex="-1"
          role="dialog"
        >
          <div
            className="modal-dialog"
            role="document"
            style={{ marginTop: '250px' }}
          >
            <div className="modal-content" style={{ width: 'auto' }}>
              <div className="modal-header" style={{ padding: '0' }}>
                <h5 className="modal-title" style={{ textAlign: 'center' }}>
                  &nbsp;
                </h5>

                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{ marginTop: '-55px' }}
                >
                  <i
                    className="fa fa-times-circle"
                    style={{
                      marginTop: '-55px',
                      fontSize: '24px',
                      color: 'rgb(255, 255, 255)'
                    }}
                  >
                    {''}
                  </i>
                </button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <p style={{ color: '#009345' }} className="checkDes">
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
                      </i>{' '}
                      Nice. A new item has been added to your Shopping Cart.
                    </p>

                    <p style={{ color: '#009345' }} className="checkMobile">
                      <i
                        className="fa fa-check"
                        style={{
                          fontSize: '20px',
                          color: 'white',
                          backgroundColor: '#009345',
                          borderRadius: '40px'
                        }}
                      >
                        {''}
                      </i>{' '}
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

        <div className="modal" id="WishListModal" tabIndex="-1" role="dialog">
          <div
            className="modal-dialog"
            role="document"
            style={{ marginTop: '250px' }}
          >
            <div className="modal-content" style={{ width: 'auto' }}>
              <div className="modal-header" style={{ padding: '0' }}>
                <h5 className="modal-title" style={{ textAlign: 'center' }}>
                  &nbsp;
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{ marginTop: '-55px' }}
                >
                  <i
                    className="fa fa-times-circle"
                    style={{
                      marginTop: '-55px',
                      fontSize: '24px',
                      color: 'rgb(255, 255, 255)'
                    }}
                  >
                    {''}
                  </i>
                </button>
              </div>

              <div className="modal-body">
                <div className="row">
                  <div className="col-md-12 col-lg-12">
                    <p style={{ color: '#009345' }} className="checkDes">
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
                      </i>{' '}
                      Nice. A new item has been added to your Wish List.
                    </p>
                    <p style={{ color: '#009345' }} className="checkMobile">
                      <i
                        className="fa fa-check"
                        style={{
                          fontSize: '20px',
                          color: 'white',
                          backgroundColor: '#009345',
                          borderRadius: '40px'
                        }}
                      >
                        {''}
                      </i>{' '}
                      Nice. A new item has been added to your Wish List.
                    </p>{' '}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-1 col-lg-1">{''}</div>
                  <div className="col-md-3 col-lg-3">
                    <a
                      href="/wish"
                      className="btn btn-success"
                      style={{
                        backgroundColor: '#ec1c24',
                        borderColor: '#ec1c24'
                      }}
                    >
                      View Wish List
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

        <br />
        <Navbar />

        <div className="row">
          <div className="medium-4 large-4 columns">
            <div className="row" style={{ marginTop: '0px' }}>
              <div className="medium-9 large-9 columns">
                <div className="img-zoom-container">
                  <img
                    id="myimage"
                    src={
                      fileUrl +
                      '/upload/product/productImages/' +
                      this.state.showClickedImage
                    }
                    width="500"
                    height="500"
                    alt={''}
                  />
                </div>
              </div>

              <div
                id="zoomResult"
                className="medium-3 large-3 columns"
                style={{
                  zIndex: 1000,
                  visibility: 'hidden',
                  marginRight: '-15px'
                }}
              >
                <div id="myresult" className="img-zoom-result">
                  {''}
                </div>
              </div>
            </div>

            {/*<OwlCarousel
              style={{ marginTop: "38%" }}
              className="owl-theme"
              margin={10}
              items={3}
              nav
            >
              {carouselImages && this.showCarouselSlider()}
            </OwlCarousel>*/}

            <OwlCarousel
              style={{ marginTop: '15px', marginBottom: '10px' }}
              className="owl-theme"
              margin={10}
              {...options}
            >
              {carouselImages.map(
                item =>
                  item && (
                    // eslint-disable-next-line
                    <a
                      key={item.serialNumber}
                      onClick={() => {
                        this.setState({ showClickedImage: item.imageName });
                        window.imageZoom(
                          'myimage',
                          'myresult',
                          fileUrl +
                            '/upload/product/productImages/' +
                            item.imageName
                        );
                      }}
                    >
                      <div className="frameZoomSlider">
                        <span className="helperZoomSlider">
                          <img
                            src={`${fileUrl}/upload/product/productImages/${item.imageName}`}
                            alt={''}
                          />
                        </span>
                      </div>
                    </a>
                  )
              )}
            </OwlCarousel>
          </div>

          <div className="medium-5 columns" style={{ zIndex: 0 }}>
            <h3>{this.state.productName}</h3>
            <div className="rating1">
              <span className="starRating">
                <input id="rating5" type="radio" name="rating" value="5" />
                <label htmlFor="rating5">5</label>
                <input id="rating4" type="radio" name="rating" value="4" />
                <label htmlFor="rating4">4</label>
                <input
                  id="rating3"
                  type="radio"
                  name="rating"
                  value="3"
                  checked
                />
                <label htmlFor="rating3">3</label>
                <input id="rating2" type="radio" name="rating" value="2" />
                <label htmlFor="rating2">2</label>
                <input id="rating1" type="radio" name="rating" value="1" />
                <label htmlFor="rating1">1</label>
              </span>
            </div>

            {/*Select Color*/}
            {colors.length > 0 && (
              <div className="color-quality">
                <div className="color-quality-left">
                  <h5>
                    Color: <b>{selectedColorName}</b>
                  </h5>
                  <ul>
                    {colors.map(
                      ({ colorId, imageName, colorName, seletected }) => (
                        <li key={colorId} onClick={this.selectColorHandler}>
                          <div
                            className={seletected ? 'withBorder' : 'noBorder'}
                          >
                            <img
                              src={
                                !!imageName
                                  ? `${fileUrl}/upload/product/productImages/${imageName}`
                                  : `${fileUrl}/assets/img/default.png`
                              }
                              className="img-responsive"
                              id={colorId}
                              name={colorName}
                              alt={colorName}
                              width="50"
                              height="38"
                            />
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className="clearfix"> </div>
              </div>
            )}

            <div className="color-quality">
              {/*Select Size*/}
              {sizes.length > 0 && (
                <div className="color-quality-left">
                  <label style={{ fontWeight: '100' }}>
                    Select Size
                    <select
                      value={selectedSizeId}
                      onChange={this.selectSizeHandler}
                    >
                      <option value="">Select a Size</option>
                      {sizes.map(({ id, size, size_type_id }) => (
                        <option value={id}>{size}</option>
                      ))}
                    </select>
                  </label>
                </div>
              )}

              <div className="color-quality-right">
                <h5>Quantity </h5>
                <div className="quantity">
                  <div className="quantity-select">
                    <div
                      onClick={this.handleClickMinus}
                      className="entry value-minus1"
                    >
                      &nbsp;
                    </div>
                    <div className="entry value1">
                      <span>{this.state.productQuantity}</span>
                    </div>
                    <div
                      onClick={this.handleClickPlus}
                      className="entry value-plus1 active"
                    >
                      &nbsp;
                    </div>
                  </div>
                </div>
              </div>
              <div className="clearfix"> </div>
            </div>

            <div className="simpleCart_shelfItem">
              <p>
                {this.state.discountAmount === 0 ? (
                  <Fragment>
                    <i className="item_price">৳{this.state.productPrice}</i>
                  </Fragment>
                ) : (
                  <Fragment>
                    <span>৳{this.state.productPrice}</span>{' '}
                    <i className="item_price">
                      ৳{this.state.productPrice - this.state.discountAmount}
                    </i>
                  </Fragment>
                )}
              </p>
              <form action="#" method="post">
                <input type="hidden" name="cmd" value="_cart" />
                <input type="hidden" name="add" value="1" />
                <input type="hidden" name="w3ls_item" value="Smart Phone" />
                <input type="hidden" name="amount" value="450.00" />

                {!localStorage.customer_id ? (
                  <button
                    type="button"
                    onClick={this.addCartLocal}
                    style={{ backgroundColor: '009345', marginRight: '10px' }}
                    className="w3ls-cart"
                  >
                    Add to cart
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={this.addCartDirect('add_to_cart')}
                    style={{ backgroundColor: '009345', marginRight: '10px' }}
                    className="w3ls-cart"
                  >
                    Add to cart
                  </button>
                )}

                {!localStorage.customer_id ? (
                  <button
                    type="button"
                    onClick={this.addWishLocal}
                    style={{ backgroundColor: '009345' }}
                    className="w3ls-cart"
                  >
                    Add to wish list
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={this.addWishDirect}
                    style={{ backgroundColor: '009345' }}
                    className="w3ls-cart"
                  >
                    Add to wish list
                  </button>
                )}
              </form>
            </div>
          </div>

          <div className="modal" id="exampleModal" tabIndex="-1" role="dialog">
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
                      <img src="/image/banijjoLogo.png" alt="" />
                    </span>
                  </div>
                </div>
                <ul className="nav nav-tabs">
                  <li className="active" style={{ paddingLeft: '80px' }}>
                    <a data-toggle="tab" href="#home">
                      REGISTER
                    </a>
                  </li>
                  <li style={{ paddingLeft: '30px' }}>
                    <a data-toggle="tab" href="#menu1">
                      Sign In
                    </a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="home" className="tab-pane fade in active">
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
                            {/*eslint-disable-next-line*/}
                            <a href={`!#`} target="_blank">
                              Forgot Password?
                            </a>
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div id="menu1" className="tab-pane fade">
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
                            {/*eslint-disable-next-line*/}
                            <a href="!#" target="_blank">
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
        </div>
        <p className="mobileGap">&nbsp;</p>

        <div className="row">
          <div className="sap_tabs">
            <div
              id="horizontalTab1"
              style={{
                display: 'block',
                width: '100%',
                margin: '0px',
                paddingLeft: '6px'
              }}
            >
              <ul>
                <li
                  className="resp-tab-item"
                  aria-controls="tab_item-0"
                  role="tab"
                >
                  <span>OVERVIEW</span>
                </li>
                <li
                  className="resp-tab-item"
                  aria-controls="tab_item-1"
                  role="tab"
                >
                  <span>CUSTOMER REVIEWS</span>
                </li>
                <li
                  className="resp-tab-item"
                  aria-controls="tab_item-2"
                  role="tab"
                >
                  <span>SPECIFICATIONS</span>
                </li>
              </ul>

              <div
                className="tab-1 resp-tab-content additional_info_grid"
                aria-labelledby="tab_item-0"
              >
                {this.productDescriptions()}
              </div>

              <div
                className="tab-2 resp-tab-content additional_info_grid"
                aria-labelledby="tab_item-1"
              >
                <h4>(2) Reviews</h4>
                <div className="additional_info_sub_grids">
                  <div className="medium-2 additional_info_sub_grid_left">
                    <img
                      src="/image/t1.png"
                      alt=" "
                      className="img-responsive"
                    />
                  </div>
                  <div className="medium-10 additional_info_sub_grid_right">
                    <div className="additional_info_sub_grid_rightl">
                      <a href="single.html">Laura</a>
                      <h5>Oct 06, 2016.</h5>
                      <p>
                        Quis autem vel eum iure reprehenderit qui in ea
                        voluptate velit esse quam nihil molestiae consequatur,
                        vel illum qui dolorem eum fugiat quo voluptas nulla
                        pariatur.
                      </p>
                    </div>
                    <div className="additional_info_sub_grid_rightr">
                      <div className="rating">
                        <div className="rating-left">
                          <img
                            src="/image/star-.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star-.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star-.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="clearfix"> </div>
                      </div>
                    </div>
                    <div className="clearfix"> </div>
                  </div>
                  <div className="clearfix"> </div>
                </div>
                <div className="additional_info_sub_grids">
                  <div className="medium-2 additional_info_sub_grid_left">
                    <img
                      src="/image/t2.png"
                      alt=" "
                      className="img-responsive"
                    />
                  </div>
                  <div className="medium-10 additional_info_sub_grid_right">
                    <div className="additional_info_sub_grid_rightl">
                      <a href="single.html">Michael</a>
                      <h5>Oct 04, 2016.</h5>
                      <p>
                        Quis autem vel eum iure reprehenderit qui in ea
                        voluptate velit esse quam nihil molestiae consequatur,
                        vel illum qui dolorem eum fugiat quo voluptas nulla
                        pariatur.
                      </p>
                    </div>
                    <div className="additional_info_sub_grid_rightr">
                      <div className="rating">
                        <div className="rating-left">
                          <img
                            src="/image/star-.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star-.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="rating-left">
                          <img
                            src="/image/star.png"
                            alt=" "
                            className="img-responsive"
                          />
                        </div>
                        <div className="clearfix"> </div>
                      </div>
                    </div>
                    <div className="clearfix"> </div>
                  </div>
                  <div className="clearfix"> </div>
                </div>
                <div className="review_grids">
                  <h5>Add A Review</h5>
                  <form action="#" method="post">
                    {/* <input type="text" name="Name" value="Name" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Name';}" required=""/>
                    <input type="email" name="Email" placeholder="Email" required=""/>
                    <input type="text" name="Telephone" value="Telephone" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Telephone';}" required=""/>
                    <textarea name="Review" onfocus="this.value = '';" onblur="if (this.value == '') {this.value = 'Add Your Review';}" required="">Add Your Review</textarea>
                  <input type="submit" value="Submit" /> */}
                  </form>
                </div>
              </div>

              <div
                className="tab-1 resp-tab-content additional_info_grid"
                aria-labelledby="tab_item-2"
              >
                <div className="row">
                  <div className="medium-6 large-6 columns">
                    {this.state.product_specification_details_description
                      ? this.state.product_specification_details_description.forEach(
                          (item, key) => {
                            if (counter === 1) {
                              if ((key + 1) % 8 === 0) {
                                counter = key;
                                return false;
                              } else {
                                return (
                                  <li>
                                    {item.specificationDetailsName}:{' '}
                                    {item.specificationDetailsValue}
                                  </li>
                                );
                              }
                            }
                          }
                        )
                      : ''}
                  </div>

                  <div className="medium-6 large-6 columns">
                    {counter > 1
                      ? this.state.product_specification_details_description.map(
                          (item, key) => {
                            if (key >= counter) {
                              return (
                                <li>
                                  {counter}
                                  {item.specificationDetailsName}:{' '}
                                  {item.specificationDetailsValue}
                                </li>
                              );
                            }
                            return '';
                          }
                        )
                      : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {productListSmCategory.length > 0 && (
          <div className="row" style={{ marginTop: '10px' }}>
            <div className="medium-12 columns">
              <h5
                style={{
                  color: '#009345',
                  marginTop: '5px',
                  marginBottom: '5px'
                }}
                className="text-left"
              >
                Similar Products
                <a href={`/productList/${category_id}`}>
                  <span
                    style={{
                      float: 'right',
                      color: '#009345',
                      fontSize: '14px'
                    }}
                  >
                    See more
                  </span>
                </a>
              </h5>

              {/*Desktop View*/}
              <div className="row small-up-6 desview">
                {/*{this.sameProductsOtherVendorDesktop()}*/}
                <ListingSameVendorsSameProducts
                  products={productListSmCategory}
                  classes={['frameMore', 'helperframeMore']}
                />
              </div>

              {/*Mobile view*/}
              <div className="row small-up-3 moreCat">
                {/*{this.sameProductsOtherVendorMobile()}*/}
                <ListingSameVendorsSameProducts
                  products={productListSmCategory}
                  classes={['moreCatDiv', 'moreCatSpan']}
                />
              </div>
            </div>
          </div>
        )}

        {productListSmVendor.length > 0 && (
          <div className="row" style={{ marginTop: '10px' }}>
            <div className="medium-12 columns">
              <h5
                style={{
                  color: '#009345',
                  marginTop: '5px',
                  marginBottom: '5px'
                }}
                className="text-left"
              >
                Same Vendor Other Products{' '}
                <a href={`/vendor/${vendor_id}`}>
                  <span
                    style={{
                      float: 'right',
                      color: '#009345',
                      fontSize: '14px'
                    }}
                  >
                    See more
                  </span>
                </a>
              </h5>

              {/*Desktop View*/}
              <div className="row small-up-6 desview">
                <ListingSameVendorsSameProducts
                  classes={['frameMore', 'helperframeMore']}
                  products={productListSmVendor}
                />
                {/*{this.sameVendorOtherProductsDeskTop()}*/}
              </div>

              {/*Mobile view*/}
              <div className="row small-up-3 moreCat">
                {/*{this.sameVendorOtherProductsMobile()}*/}
                <ListingSameVendorsSameProducts
                  classes={['moreCatDiv', 'moreCatSpan']}
                  products={productListSmVendor}
                />
              </div>
              <div className="row column">&nbsp;</div>
            </div>
          </div>
        )}

        <Footer />
      </React.Fragment>
    );
  }
}
export default ProductDetails;

// setTimeout(() => {
//   const {
//     productId,
//     selectedSizeId,
//     selectedColorId,
//     selectedProductStockAmount,
//     productQuantity
//   } = this.state;
//
//   if (selectedColorId === '') {
//     this.showAlert('Please Select a Color');
//   } else if (selectedSizeId === '') {
//     this.showAlert('Please Select a Size');
//   } else if (selectedProductStockAmount < productQuantity) {
//     this.showAlert(
//         'This color and size combination are out of stock! Please Select another Color or Size'
//     );
//   } else {
//     let cartArr = [
//       {
//         productId: this.state.productId,
//         quantity: this.state.productQuantity
//       }
//     ];
//     let cartDataExisting = JSON.parse(localStorage.getItem('cart'));
//     localStorage.removeItem('cart');
//
//     if (cartDataExisting) {
//       cartDataExisting.push({
//         productId: this.state.productId,
//         quantity: this.state.productQuantity
//       });
//       localStorage.setItem('cart', JSON.stringify(cartDataExisting));
//     } else {
//       localStorage.setItem('cart', JSON.stringify(cartArr));
//     }
//     var link = document.getElementById('successCartMessage');
//     link.click();
//   }
// }, 100);
