import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
const fileUrl = process.env.REACT_APP_FILE_URL;

const FeaturedBannerProds = ({ prodsImags }) => {
  const options = {
    items: 5,
    rewind: true,
    autoplay: true,
    slideBy: 1,
    loop: true
  };

  return (
    <OwlCarousel className="owl-theme" margin={10} {...options}>
      {prodsImags.map(({ home_image }, index) => (
        <div className="frameSlider">
          <span className="helperSlider" style={{ paddingBottom: "10px" }}>
            <img
              src={`${fileUrl}/upload/product/productImages/${home_image}`}
              alt="Product Image."
            />
          </span>
        </div>
      ))}
    </OwlCarousel>
  );
};

export default FeaturedBannerProds;
