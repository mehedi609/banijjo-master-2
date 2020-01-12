import React, { Component } from "react";

class SubcategoryList extends Component {
  render() {
    const { category, lastChilds } = this.props;
    return (
      <ul key className="spvmm_submm_ul">
        <li className="spvmm_submm_li  spvmm-havechildchild">
          <a className="megamenu_a" href={"/productList/" + category.id}>
            {category.category_name}
          </a>
          {lastChilds.length > 0 ? (
            lastChilds.map(item => {
              return (
                <React.Fragment>
                  <ul
                    className="spvmm_submm_ul"
                    style={{
                      zIndex: 1000
                    }}
                  >
                    <li className="spvmm_submm_li">
                      <a
                        className="megamenu_a"
                        href={"/productList/" + item.id}
                      >
                        {item.category_name}
                      </a>
                    </li>
                  </ul>
                </React.Fragment>
              );
            })
          ) : (
            <p style={{ color: "#ec1c24", paddingLeft: "20px" }}>
              No More Categories
            </p>
          )}
        </li>
      </ul>
    );
  }
}

export default SubcategoryList;
