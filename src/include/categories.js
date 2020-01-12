import React, { Component } from "react";
import SubcategoryList from "./subcategoryList";
// import $ from "jquery";
// import "./superfish";

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const baseUrl = process.env.REACT_APP_FRONTEND_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;

class Categories extends Component {
  state = {
    Categories: []
  };

  componentDidMount() {
    this.getAllCategories();

    /*$(
      "#sp_vertical_megamenu li:has(.spvmm_container_menu_child)"
    ).doubleTapToGo();
    function isMobile() {
      if (
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)
      ) {
        return true;
      }
    }

    $(document).ready(function($) {
      (function(element) {
        var el = $(element),
          vf_megamenu = $(".vf-megamenu", el),
          level1 = $(".vf-megamenu >.spvmm-havechild", el),
          _li = $(".spvmm-havechild", el),
          vf_button = $(".vf-button", el),
          nb_hiden = 10;
        if (level1.length && level1.length > nb_hiden) {
          for (var i = 0; i < level1.length; i++) {
            if (i > nb_hiden - 1) {
              level1.eq(i).addClass("cat-visible");
              level1.eq(i).hide();
            }
          }
          vf_megamenu.append(
            '<li class="more-wrap"><span class="more-view"><i class="fa fa-plus-square-o"></i>More Categories</span></li>'
          );
          $(".more-view", vf_megamenu).on("click touchstart", function() {
            if (level1.hasClass("cat-visible")) {
              vf_megamenu
                .find(".cat-visible")
                .removeClass("cat-visible")
                .addClass("cat-hidden")
                .stop()
                .slideDown(400);
              $(this).html(
                '<i class="fa fa-minus-square-o"></i>Close Categories'
              );
            } else if (level1.hasClass("cat-hidden")) {
              vf_megamenu
                .find(".cat-hidden")
                .removeClass("cat-hidden")
                .addClass("cat-visible")
                .stop()
                .slideUp(200);
              $(this).html(
                '<i class="fa fa-plus-square-o"></i>More Categories'
              );
            }
          });
        }

        function _vfResponsiveMegaMenu() {
          if ($(window).width() <= 767) {
            vf_megamenu.hide();
            $(".cat-title", el).on("click", function() {
              $(this)
                .toggleClass("active")
                .parent()
                .find("ul.vf-megamenu")
                .stop()
                .slideToggle("medium");
              return false;
            });
            _li.addClass("vf-close");
            _li.children("div").css("display", "none");
            if (vf_button.length) {
              vf_button.on("click", function() {
                var _this = $(this),
                  li = _this.parent(),
                  ul = li.children("ul");
                var _div = li.children("div");
                if (li.hasClass("vf-close")) {
                  li.removeClass("vf-close").addClass("vf-open");
                  _div.stop(false, true).slideDown(500);
                  _this.removeClass("icon-close").addClass("icon-open");
                } else {
                  li.removeClass("vf-open").addClass("vf-close");
                  _div.stop(false, true).slideUp(200);
                  _this.removeClass("icon-open").addClass("icon-close");
                }
                return;
              });
            }
          } else {
            $(".cat-title", el).unbind("click");
            vf_button.unbind("click");
            $(".cat-title", el).removeClass("active");
            vf_megamenu.removeAttr("style");
            _li.addClass("vf-close");
            _li.children("div").removeAttr("style");
            vf_button.removeClass("icon-open").addClass("icon-close");
          }
        }
        _vfResponsiveMegaMenu();

        if (isMobile()) {
        } else {
          $(window).on("resize", function() {
            _vfResponsiveMegaMenu();
          });
        }
      })("#sp_vertical_megamenu");
  });*/
  }

  getAllCategories() {
    fetch(base + "/api/all_category_list", {
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(categories => {
        this.setState({
          Categories: categories.data
        });
        return false;
      });
  }

  renderVendorImages(ven_images) {
    return ven_images.map(item => (
      <li className="sup-brand-item" key={item.vendor_id}>
        <a href={"/vendor/" + item.vendor_id}>
          {item.logo !== null ? (
            <img src={fileUrl + "/upload/product/productImages/" + item.logo} />
          ) : (
            <img src={fileUrl + "/upload/product/productImages/default.png"} />
          )}
        </a>
      </li>
    ));
  }

  render() {
    return (
      <React.Fragment>
        <div
          className="medium-3 large-3 columns"
          style={{ marginTop: "-27px" }}
        >
          <div
            id="sp_vertical_megamenu"
            className="sp-vertical-megamenu clearfix"
          >
            <h2 className="cat-title">
              <i className="fa fa-list-ul" aria-hidden="true"></i> Categories
            </h2>

            <ul className="vf-megamenu clearfix megamenu-content">
              {this.state.Categories.length > 0 ? (
                this.state.Categories.map(
                  ({ category, subcategories, vendorImages }) => {
                    return (
                      <React.Fragment>
                        <li className="spvmm-havechild" key={category.id}>
                          <a
                            className="megamenu_a"
                            href={"/productList/" + category.id}
                          >
                            {category.category_name}
                          </a>
                          <span className="vf-button icon-close"></span>

                          <div className="spvmm_container_menu_child">
                            <div
                              className="spvmm_menu_child"
                              style={{ width: "902px" }}
                            >
                              <div className="spvmm_numbers_col col4">
                                <div className="row">
                                  {subcategories.length > 0 ? (
                                    subcategories.map(
                                      ({ category, lastChilds }) => (
                                        <SubcategoryList
                                          category={category}
                                          lastChilds={lastChilds}
                                        />
                                      )
                                    )
                                  ) : (
                                    <p
                                      style={{
                                        color: "#ec1c24",
                                        paddingLeft: "20px"
                                      }}
                                    >
                                      No Categories to show
                                    </p>
                                  )}
                                </div>

                                {vendorImages.length > 0 && (
                                  <div className="row">
                                    <p
                                      className="vendorImageMobile"
                                      style={{
                                        paddingLeft: "20px",
                                        marginBottom: "0px",
                                        fontWeight: "bolder",
                                        color: "#000000",
                                        fontSize: "13px"
                                      }}
                                    >
                                      Vendor Image
                                    </p>
                                    <ul className="spvmm_submm_ul">
                                      <div className="sub-cate-row scp-cate-brand">
                                        <ul className="sub-brand-list">
                                          {this.renderVendorImages(
                                            vendorImages
                                          )}
                                        </ul>
                                      </div>
                                    </ul>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      </React.Fragment>
                    );
                  }
                )
              ) : (
                <p style={{ color: "#ec1c24" }}>No More Categories</p>
              )}

              <li style={{ textAlign: "left" }} className="spvmm-nochild">
                <a
                  href="/moreCategory"
                  style={{ color: "#ec1c24", textAlign: "center" }}
                  className="megamenu_a"
                >
                  <i className="fa fa-plus-circle" style={{ color: "#009345" }}>
                    {" "}
                    More
                  </i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Categories;
