import React from "react";
import PropTypes from "prop-types";

const CardToListProducts = ({ img_src, classes, link }) => {
  const [class1, class2] = classes;
  return (
    <a href={link}>
      <div className={class1}>
        <span className={class2}>
          <img src={img_src} alt="Img" />
        </span>
      </div>{" "}
    </a>
  );
};

CardToListProducts.propTypes = {
  img_src: PropTypes.string.isRequired,
  classes: PropTypes.array.isRequired,
  link: PropTypes.string.isRequired
};

export default CardToListProducts;
