import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
const fileUrl = process.env.REACT_APP_FILE_URL;

const CarouselSliderBannerImgs = ({ bannerImages }) => {
  const options = {
    items: 5,
    rewind: true,
    autoplay: true,
    slideBy: 1,
    loop: true
  };

  return (
    <OwlCarousel className="owl-theme" margin={10} {...options}>
      {bannerImages.map(
        item =>
          item && (
            <a href={"/productDetails/" + item.productId}>
              <div className="frameSlider" key={item.productId}>
                <span className="helperSlider">
                  <img
                    src={`${fileUrl}/upload/product/productImages/${item.productImage}`}
                    alt="Product Image."
                  />
                </span>
              </div>
            </a>
          )
      )}
    </OwlCarousel>
  );
};

export default CarouselSliderBannerImgs;
