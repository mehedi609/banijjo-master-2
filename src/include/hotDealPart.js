import React, { Component } from "react";
import { Link } from "react-router-dom";
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const baseUrl = process.env.REACT_APP_FRONTEND_Local_SERVER_URL;

class HotDealPart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      allProductList: [],
      HotDeals: []
    };
  }

  componentDidMount() {
    this.getProductList();
    this.getAllProductList();
  }

  getAllProductList() {
    fetch(base + "/api/all_product_list", {
      method: "GET"
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(products => {
        if (products.data.HotDeals[0]) {
          this.setState({
            HotDeals: JSON.parse(products.data.HotDeals[0].feature_products)
          });
        }
        return false;
      });
  }

  hotDeal() {
    let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.HotDeals.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <img
                style={{ height: "114px" }}
                className="thumbnail"
                src={
                  base + "/upload/product/productImages/" + item.productImage
                }
              />
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 5) {
      for (let i = counter; i < 5; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <img
                style={{ height: "114px" }}
                className="thumbnail"
                src="/asche.jpg"
              />
            </a>
          </div>
        );
      }
    }
    return hotView;
  }

  getProductList() {
    fetch(base + "/api/product_list", {
      method: "GET"
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(products => {
        console.log(products.data);
        this.setState({
          productList: products.data
        });
        return false;
      });
  }

  handleClick(id) {
    window.location = "/productDetails/" + id;
  }

  getStuff() {
    var elements = this.state.productList.map(function(product, i) {
      //   return  <span key={feature.Id}>{feature.Description}</span>
      return (
        <div className="column">
          <Link onClick={() => this.handleClick(product.id)} to={"#"}>
            {/* <img src={"/image/products/"+product.image} alt="image for article"/> */}
            {/* <img src={"/image/default.jpg"} alt="image for article"/> */}
            <img src={"/asche.jpg"} alt="image for article" />
          </Link>
        </div>
      );
    }, this);

    return elements;
  }

  render() {
    return (
      <div className="row">
        <div className="medium-12 columns">
          <h5 style={{ margin: "0" }} className="text-left">
            Hot Deals
          </h5>

          <div className="row small-up-5">{this.hotDeal()}</div>
        </div>
      </div>
    );
  }
}

export default HotDealPart;
