import React, { Component } from "react";
import Header from "../include/header";
import Footer from "../include/footer";
import Breadcums from "../include/breadcums";
import Categories from "../include/categories";
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
class MoreCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Categories: [],
      textArray: [],
      allCategories: []
    };
  }
  componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories() {
    fetch(base + "/api/all_category_list_more", {
      method: "GET"
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
      .then(categories => {
        console.log("cccccccc", categories);
        this.setState({
          Categories: categories.data
          // allCategories :categories.data.allCategories
        });
        return false;
      });
  }
  render() {
    let url = "http://admin.banijjo.com.bd";
    let counter = 1;
    let specificationName = "";
    return (
      <React.Fragment>
        <br />
        <Breadcums />
        {this.state.Categories.length > 1 ? (
          this.state.Categories.map((item, key) => {
            return (
              <React.Fragment>
                <div class="row">
                  <div style={{ marginLeft: "15%" }} class="container">
                    <div class="cg-main">
                      <div class="item util-clearfix">
                        <h3 class="big-title anchor1 anchor-agricuture">
                          <span id="anchor1" class="anchor-subsitution"></span>
                          <i class="cg-icon"></i>
                          <a
                            style={{ color: "#009345" }}
                            href={"/productList/" + item.category.id}
                          >
                            {item.category.category_name}
                          </a>
                        </h3>
                        <div class="sub-item-wrapper util-clearfix">
                          {item.subcategories.length > 0 ? (
                            item.subcategories.map((item2, key2) => {
                              return (
                                <React.Fragment>
                                  <div class="sub-item">
                                    <h4 class="sub-title">
                                      <a
                                        href={
                                          "/productList/" + item2.category.id
                                        }
                                        style={{
                                          color: "#ec1c24",
                                          textDecoration: "none"
                                        }}
                                      >
                                        {item2.category.category_name}
                                      </a>
                                      <span>{/* (3978931) */}</span>
                                    </h4>
                                    <div class="sub-item-cont-wrapper">
                                      <ul class="sub-item-cont util-clearfix">
                                        {item2.lastChilds.length > 0 ? (
                                          item2.lastChilds.map(
                                            (item3, key3) => {
                                              return (
                                                <React.Fragment>
                                                  <ul className="spvmm_submm_ul">
                                                    <li className="spvmm_submm_li ">
                                                      <a
                                                        className="megamenu_a"
                                                        href={
                                                          "/productList/" +
                                                          item3.id
                                                        }
                                                        title="T-shirts"
                                                      >
                                                        {item3.category_name}
                                                      </a>
                                                    </li>
                                                  </ul>
                                                  <li>
                                                    <a
                                                      href={
                                                        "/productList/" +
                                                        item3.id
                                                      }
                                                    >
                                                      {item3.category_name}
                                                    </a>
                                                  </li>
                                                </React.Fragment>
                                              );
                                            }
                                          )
                                        ) : (
                                          <p style={{ color: "#ec1c24" }}>
                                            No More Sub-Categories
                                          </p>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </React.Fragment>
                              );
                            })
                          ) : (
                            <p style={{ color: "#ec1c24" }}>
                              No More Sub-Categories
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })
        ) : (
          <p style={{ color: "#ec1c24" }}>No More Categories</p>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}
export default MoreCategory;
