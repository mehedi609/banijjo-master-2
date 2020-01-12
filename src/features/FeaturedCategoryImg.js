import React, { Fragment } from "react";
const fileUrl = process.env.REACT_APP_FILE_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const FeaturedCategoryImg = ({ id, img }) => {
  return (
    <Fragment>
      <a href={`/productList/${id}`}>
        <div
          className="frameFeatureCatSm"
          style={{ borderBottom: "1px solid #ddd" }}
        >
          <span className="helperframeFeatureCatSm">
            <img
              src={`${fileUrl}/upload/product/productImages/${img}`}
              alt="Featured Bands"
            />
          </span>
        </div>
      </a>
    </Fragment>
  );
};

export default FeaturedCategoryImg;
