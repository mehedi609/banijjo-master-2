import React, { Component } from 'react';
import TopNavbarCategories from './TopNavbarCategories';

const homeUrl = process.env.REACT_APP_FRONTEND_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemCount: '',
      customerId: localStorage.customer_id,
      searchKeyText: '',
    };
    this.searchItem = this.searchItem.bind(this);
  }

  componentDidMount() {
    this.getCustomerCartProducts();
  }

  getCustomerCartProducts() {
    if (!localStorage.customer_id) {
      let cartData = JSON.parse(localStorage.getItem('cart'));
      let productIds = [];

      if (cartData) {
        cartData.map(function(val, index) {
          productIds.push(val.productId);
        });
        let uniqueProductIds = productIds.filter(
          (v, i, a) => a.indexOf(v) === i,
        );
        let revisedCartData = [];
        uniqueProductIds.map(function(valParent, keyParent) {
          let totalCount = 0;
          cartData.map(function(val, key) {
            if (valParent === val.productId) {
              totalCount += val.quantity;
            }
          });
          revisedCartData.push({ productId: valParent, quantity: totalCount });
        });
        this.setState({
          cartItemCount: revisedCartData.length,
        });
      } else {
        this.setState({
          cartItemCount: 0,
        });
      }
    } else {
      fetch(base + '/api/getCustomerCartProductsCount', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId: this.state.customerId,
        }),
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          console.log('rererere', response);
          this.setState({
            cartItemCount: response.data[0].counting,
          });
        });
    }
  }

  searchItem(event) {
    event.preventDefault();
    this.setState({ searchKeyText: event.target.searchKey.value });
    window.location.href = '/search/' + event.target.searchKey.value;
  }

  render() {
    return (
      <React.Fragment>
        <div className="row" style={{ marginTop: -40 }}>
          <div className="medium-3 large-3 columns">
            <p className="gap">&nbsp;</p>
          </div>
          <div className="medium-6 columns">
            <form onSubmit={this.searchItem}>
              <div className="input-group input-group-rounded">
                <input
                  name="searchKey"
                  className="input-group-field ex1"
                  style={{ border: '1px solid #009345' }}
                  type="search"
                  placeholder="Search Item"
                />
                <div className="input-group-button">
                  <input
                    type="submit"
                    style={{ background: '#ec1c24' }}
                    className="button secondary"
                    value="&#xf002;"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="medium-3 large-3 columns">
            <div className="cartHead">
              <a className="" href="/cart" style={{ color: '#009345' }}>
                <i
                  className="fa fa-shopping-cart"
                  style={{ fontSize: '40px' }}
                ></i>{' '}
                Cart
                <span
                  className="badge badge-light"
                  style={{ backgroundColor: '#ec1624' }}
                >
                  {this.state.cartItemCount > 0 ? this.state.cartItemCount : 0}
                </span>
              </a>
            </div>
          </div>
          <div
            className="columns small-6 large-4"
            style={{ marginTop: '12px' }}
          >
            <div className="cartIcon">
              <a
                class=""
                href="/cart"
                style={{ color: '#009345', fontSize: '12px' }}
              >
                <i class="fa fa-shopping-cart" style={{ fontSize: '18px' }}></i>
                <span
                  class="badge badge-light"
                  style={{ backgroundColor: '#ec1624', fontSize: '8px' }}
                >
                  {this.state.cartItemCount > 0 ? this.state.cartItemCount : 0}
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="medium-3 large-3 columns">
            <p className="gap">&nbsp;</p>
          </div>
          <TopNavbarCategories />
          <div className="medium-1 large-1 columns">
            <p className="gap">&nbsp;</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Navbar;
