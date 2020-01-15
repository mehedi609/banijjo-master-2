import React, { Fragment } from "react";
const fileUrl = process.env.REACT_APP_FILE_URL;

const FeaturedCategoryImg = ({ id, img }) => {
  return (
    <Fragment>
      <a href={`/productList/${id}`}>
        <div className="frameFeatureCatSm">
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
