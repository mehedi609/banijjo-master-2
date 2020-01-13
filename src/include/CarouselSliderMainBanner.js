import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import PropTypes from "prop-types";
const fileUrl = process.env.REACT_APP_FILE_URL;

const CarouselSliderMainBanner = ({ bannerImagesCustom }) => {
  const options = {
    items: 1,
    rewind: true,
    autoplay: true,
    slideBy: 1,
    loop: true
  };

  return (
    <OwlCarousel className="owl-theme" margin={10} {...options}>
      {bannerImagesCustom.map(({ id, image, url }) => (
        <a href={url}>
          <div className="frameSliderBig" key={id}>
            <span className="helperSliderBig">
              <img
                src={`${fileUrl}/upload/product/productImages/${image}`}
                alt=""
              />
            </span>
          </div>
        </a>
      ))}
    </OwlCarousel>
  );
};

CarouselSliderMainBanner.propTypes = {
  bannerCarouselArr: PropTypes.array.isRequired
};

export default CarouselSliderMainBanner;
