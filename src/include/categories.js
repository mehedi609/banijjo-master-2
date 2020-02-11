import React, { Component } from 'react';
import SubcategoryList from './subcategoryList';

const base = process.env.REACT_APP_FRONTEND_SERVER_URL;
const fileUrl = process.env.REACT_APP_FILE_URL;
// const baseUrl = process.env.REACT_APP_FRONTEND_URL;

class Categories extends Component {
  state = {
    Categories: []
  };

  componentDidMount() {
    this.getAllCategories();
  }

  getAllCategories() {
    fetch(base + '/api/all_category_list', {
      method: 'GET'
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
        <a href={'/vendor/' + item.vendor_id}>
          {item.logo !== null ? (
            <img src={fileUrl + '/upload/vendor/' + item.logo} alt={''} />
          ) : (
            <img src={fileUrl + '/upload/vendor/default.png'} alt={''} />
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
          style={{ marginTop: '-27px' }}
        >
          <div
            id="sp_vertical_megamenu"
            className="sp-vertical-megamenu clearfix"
          >
            <h2 className="cat-title">
              <i className="fa fa-list-ul" aria-hidden="true"></i> Categories
            </h2>

            <ul className="vf-megamenu clearfix megamenu-content catDisplayMobile">
              {this.state.Categories.length > 0 &&
                this.state.Categories.map(
                  ({ category, subcategories, vendorImages }) => {
                    return (
                      <React.Fragment>
                        <li className="spvmm-havechild" key={category.id}>
                          <a
                            className="megamenu_a"
                            href={'/productList/' + category.id}
                          >
                            {category.category_name}
                          </a>
                          <span className="vf-button icon-close"></span>

                          <div className="spvmm_container_menu_child">
                            <div
                              className="spvmm_menu_child"
                              style={{ width: '902px' }}
                            >
                              <div className="spvmm_numbers_col col4">
                                <div className="row">
                                  {subcategories.length > 0 &&
                                    subcategories.map(
                                      ({ category, lastChilds }) => (
                                        <SubcategoryList
                                          category={category}
                                          lastChilds={lastChilds}
                                        />
                                      )
                                    )}
                                </div>

                                {vendorImages.length > 0 && (
                                  <div className="row">
                                    <p
                                      className="vendorImageMobile"
                                      style={{
                                        paddingLeft: '20px',
                                        marginBottom: '0px',
                                        fontWeight: 'bolder',
                                        color: '#000000',
                                        fontSize: '13px'
                                      }}
                                    >
                                      Brand
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
                )}

              <li style={{ textAlign: 'left' }} className="spvmm-nochild">
                <a
                  href="/moreCategory"
                  style={{ color: '#ec1c24', textAlign: 'center' }}
                  className="megamenu_a"
                >
                  <i className="fa fa-plus-circle" style={{ color: '#009345' }}>
                    {' '}
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
