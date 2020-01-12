import React, { Component } from "react";
import Footer from "../include/footer";
import Navbar from "../include/Navbar";
import Categories from "../include/categories";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryId: this.props.match.params.cid,
      status: this.props.match.params.status,
      categoryProductList: []
    };
  }

  componentDidMount() {
    this.categoryProductLIst();
  }

  categoryProductLIst() {
    if (this.state.status === "multiple") {
      fetch(base + "/api/all_category_product_list", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(products => {
          this.setState({
            categoryProductList: products.data
          });
        });
    } else {
      //  CATEGORY WISE PRODUCTS.......... CREATED AT 12/17/2019
      fetch(base + `/api/category_product_list/?id=${this.state.categoryId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          console.log(res);
          return res.json();
        })
        .then(products => {
          this.setState({
            categoryProductList: products.data
          });
        });
    }
  }

  productListDynamic() {
    let listArray = [];
    this.state.categoryProductList.length > 0
      ? this.state.categoryProductList.map((item, key) => {
          console.log();
          if (key > 1 && key % 4 === 0) {
            listArray.push(<hr />);
          }
          listArray.push(
            <React.Fragment>
              <div className="col-md-3 col-sm-6">
                <div className="product-grid7">
                  <div className="product-image7">
                    <a href={"/productDetails/" + item.id}>
                      <div
                        className="frameProductImg"
                        style={{ borderBottom: "1px solid #ddd" }}
                      >
                        <span className="helperProductImg">
                          <img
                            className="pic-1"
                            src={
                              fileUrl +
                              "/upload/product/productImages/" +
                              item.home_image
                            }
                          />
                          <img
                            className="pic-2"
                            src={
                              fileUrl +
                              "/upload/product/productImages/" +
                              item.home_image
                            }
                          />
                        </span>
                      </div>
                    </a>

                    <ul className="socialProductList">
                      <li>
                        <a href="" className="fa fa-heart-o"></a>
                      </li>
                      <li>
                        <a href="" className="fa fa-shopping-cart"></a>
                      </li>
                    </ul>
                    <span className="product-new-label">New</span>
                    <span className="product-new-label-discount">10%</span>
                  </div>
                  <div className="product-content">
                    <h3 className="title">
                      <a href="#">{item.product_name}r</a>
                    </h3>
                    <ul className="rating">
                      <li className="fa fa-star"></li>
                      <li className="fa fa-star"></li>
                      <li className="fa fa-star"></li>
                      <li className="fa fa-star"></li>
                      <li className="fa fa-star"></li>
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
            <p style={{ color: "#ec1c24" }}>No product for this category</p>{" "}
          </React.Fragment>
        );

    return listArray;
  }

  render() {
    return (
      <React.Fragment>
        <div>
          <br />
          <Navbar />

          <div className="row">
            <Categories />
            <div className="medium-9 columns">
              <div className="row">{this.productListDynamic()}</div>
              <hr />
            </div>
          </div>
          <div className="row"></div>
          <Footer />
        </div>{" "}
      </React.Fragment>
    );
  }
}
export default ProductList;
