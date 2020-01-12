import React, { Component } from "react";
import axios from "axios";
import TopNavbarCategories from "./TopNavbarCategories";

const homeUrl = process.env.REACT_APP_FRONTEND_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const frontEndUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

class Breadcums extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartItemCount: "",
      customerId: localStorage.customer_id,
      searchKeyText: ""
    };
    this.searchItem = this.searchItem.bind(this);
  }

  componentDidMount() {
    this.getCustomerCartProducts();
    this.getCategories();
  }

  getCustomerCartProducts() {
    if (!localStorage.customer_id) {
      let cartData = JSON.parse(localStorage.getItem("cart"));
      let productIds = [];

      if (cartData) {
        cartData.map(function(val, index) {
          productIds.push(val.productId);
        });
        let uniqueProductIds = productIds.filter(
          (v, i, a) => a.indexOf(v) === i
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
          cartItemCount: revisedCartData.length
        });
      } else {
        this.setState({
          cartItemCount: 0
        });
      }
    } else {
      fetch(base + "/api/getCustomerCartProductsCount", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerId: this.state.customerId
        })
      })
        .then(res => {
          return res.json();
        })
        .then(response => {
          console.log("rererere", response);
          this.setState({
            cartItemCount: response.data[0].counting
          });
        });
    }
  }

  getCategories() {
    axios
      .get(`${base}/api/getTopNavbarCategory`)
      .then(response =>
        this.setState({ ...this.state, categories: response.data })
      );
  }

  searchItem(event) {
    event.preventDefault();
    this.setState({ searchKeyText: event.target.searchKey.value });
    window.location.href = "/search/" + event.target.searchKey.value;
  }

  render() {
    return (
      <React.Fragment>
        <section className="cartDesktopView">
          <div className="row" style={{ marginTop: -40 }}>
            <div class="medium-3 large-3 columns">
              <p className="gap">&nbsp;</p>
            </div>
            <div className="medium-6 columns">
              <form onSubmit={this.searchItem}>
                <div className="input-group input-group-rounded">
                  <input
                    name="searchKey"
                    className="input-group-field ex1"
                    style={{ border: "1px solid #009345" }}
                    type="search"
                    placeholder="Search Item"
                  />
                  <div className="input-group-button">
                    <input
                      type="submit"
                      style={{ background: "#ec1c24" }}
                      className="button secondary"
                      value="&#xf002;"
                    />
                  </div>
                </div>
              </form>
            </div>

            {/*cartHeade*/}
            <div className="medium-3 large-3 columns">
              <div className="cartHead">
                <a className="" href="/cart" style={{ color: "#009345" }}>
                  <i
                    className="fa fa-shopping-cart"
                    style={{ fontSize: "40px" }}
                  ></i>{" "}
                  Cart
                  <span
                    className="badge badge-light"
                    style={{ backgroundColor: "#ec1624" }}
                  >
                    {this.state.cartItemCount > 0
                      ? this.state.cartItemCount
                      : 0}
                  </span>
                </a>
              </div>
            </div>

            {/*CartIcon*/}
            <div
              className="columns small-6 large-4"
              style={{ marginTop: "22px", paddingLeft: "8px" }}
            >
              <div className="cartIcon">
                <a href="/cart" style={{ color: "#009345", fontSize: "12px" }}>
                  <i
                    class="fa fa-shopping-cart"
                    style={{ fontSize: "18px" }}
                  ></i>{" "}
                  <span
                    class="badge badge-light"
                    style={{ backgroundColor: "#ec1624", fontSize: "13px" }}
                  >
                    {this.state.cartItemCount > 0
                      ? this.state.cartItemCount
                      : 0}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/*CLASS NAME MOBILE VIEW REMOVED FROM HERE*/}

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

export default Breadcums;
