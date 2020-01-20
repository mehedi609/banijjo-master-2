import React, { Component } from "react";
import Breadcums from "./include/breadcums";
import axios from "axios";
import Footer from "./include/footer";
import Categories from "./include/categories";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import FeaturedCategoryImg from "./features/FeaturedCategoryImg";
import CarouselSliderBannerImgs from "./include/CarouselSliderBannerImgs";
import CarouselSliderMainBanner from "./include/CarouselSliderMainBanner";
import CardToListProducts from "./features/CardToListProducts";

const fileUrl = process.env.REACT_APP_FILE_URL;
const base = process.env.REACT_APP_FRONTEND_SERVER_URL;

const img_src = `${fileUrl}/upload/product/productImages/`;
const link = "/productList/";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allProductList: [],
      HotDeals: [],
      TopSelections: [],
      NewForYou: [],
      StoreWIllLove: [],
      More: [],
      BannerImages: [],
      BannerTop: [],
      FeaturedBrands: [],
      Categories: [],
      HotDealsTitle: "",
      TopSelectionsTitle: "",
      NewForYouTitle: "",
      BannerTopTitle: "",
      StoreWIllLoveTitle: "",
      MoreTitle: "",
      BannerImagesTitle: "",
      FeaturedBrandsTitle: "",
      BannerImagesCustom: [],
      BannerCarouselArr: [],
      Advertisement: "",
      featuredCategories: [],
      featuredBannerProds: []
    };
  }

  componentDidMount() {
    this.getAllProductList();
    this.getAdvertisement();
    this.getFeatureCategory();
  }

  getFeatureCategory() {
    axios
      .get(`${base}/api/feature_category`)
      .then(res => this.setState({ featuredCategories: res.data }));
    /*fetch(`${base}/api/feature_category`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(response => this.setState({ featuredCategories: response }));*/
  }

  getAdvertisement() {
    fetch(base + "/api/getAdvertisement", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        return res.json();
      })
      .then(response => {
        if (response.data) {
          this.setState({
            Advertisement: response.data.image
          });
        }
      });
  }

  getAllProductList() {
    fetch(base + "/api/all_product_list", {
      method: "GET"
    })
      .then(res => {
        return res.json();
      })
      .then(products => {
        if (products.data.categories) {
          this.setState({
            Categories: products.data.categories,
            BannerImagesCustom: products.data.bannerImagesCustom
          });
        }
        this.setState({
          HotDealsTitle: products.data.HotDealsTitle,
          TopSelectionsTitle: products.data.TopSelectionsTitle,
          StoreWIllLoveTitle: products.data.StoreWIllLoveTitle,
          MoreTitle: products.data.MoreTitle,
          BannerImagesTitle: products.data.BannerImagesTitle,
          NewForYouTitle: products.data.NewForYouTitle,
          FeaturedBrandsTitle: products.data.FeaturedBrandsTitle,
          BannerTopTitle: products.data.BannerTopTitle
        });

        if (products.data.HotDeals[0]) {
          this.setState({
            HotDeals: JSON.parse(products.data.HotDeals[0].feature_products)
          });
        }
        if (products.data.TopSelections[0]) {
          this.setState({
            TopSelections: JSON.parse(
              products.data.TopSelections[0].feature_products
            )
          });
        }
        if (products.data.StoreWIllLove[0]) {
          this.setState({
            StoreWIllLove: JSON.parse(
              products.data.StoreWIllLove[0].feature_products
            )
          });
        }
        if (products.data.More[0]) {
          this.setState({
            More: JSON.parse(products.data.More[0].feature_products)
          });
        }
        if (products.data.BannerImages[0]) {
          this.setState({
            BannerImages: JSON.parse(
              products.data.BannerImages[0].feature_products
            )
          });
        }

        if (products.data.NewForYou[0]) {
          this.setState({
            NewForYou: JSON.parse(products.data.NewForYou[0].feature_products)
          });
        }

        if (products.data.FeaturedBrands[0]) {
          this.setState({
            FeaturedBrands: JSON.parse(
              products.data.FeaturedBrands[0].feature_products
            )
          });
        }

        if (products.data.BannerTop[0]) {
          this.setState({
            BannerTop: JSON.parse(products.data.BannerTop[0].feature_products)
          });
        }

        let coolView = [];
        let counter = 0;
        let activity = "";
        const { BannerImagesCustom } = this.state;
        if (counter === 0) {
          if (!BannerImagesCustom || BannerImagesCustom.length === 0) {
            const { BannerTop } = this.state;
            const classes = ["frameSliderBig", "helperSliderBig"];

            BannerTop.map(({ productId, productImage }, key) => {
              activity = key === 0 ? (activity = "active") : "";
              coolView.push(
                <div className={"item " + activity}>
                  <div className="row">
                    <div className="column">
                      <CardToListProducts
                        classes={classes}
                        img_src={img_src + productImage}
                        link={`/productDetails/${productId}`}
                        key={productId}
                      />
                      {/*<a href={"/productDetails/" + item.productId}>
                        <div className="frameSliderBig">
                          <span className="helperSliderBig">
                            <img
                              src={
                                fileUrl +
                                "/upload/product/productImages/" +
                                item.productImage
                              }
                              alt=""
                            />
                          </span>
                        </div>
                      </a>*/}
                    </div>
                  </div>
                </div>
              );
              counter++;
            });
          } else {
            const { BannerImagesCustom } = this.state;
            const classes = ["frameSliderBig", "helperSliderBig"];
            BannerImagesCustom.map(({ image, url }, key) => {
              activity = key === 0 ? (activity = "active") : "";
              coolView.push(
                <div className={"item " + activity}>
                  <div className="row">
                    <div className="column">
                      <CardToListProducts
                        classes={classes}
                        img_src={img_src + image}
                        link={url}
                        key={url}
                      />
                      {/*<a href={item.url}>
                        <div className="frameSliderBig">
                          <span className="helperSliderBig">
                            <img
                              src={
                                fileUrl +
                                "/upload/product/productImages/" +
                                item.image
                              }
                              alt={item.name}
                            />
                          </span>
                        </div>
                      </a>*/}
                    </div>
                  </div>
                </div>
              );
              counter++;
            });
          }
        }

        this.setState({
          BannerCarouselArr: coolView
        });

        return false;
      });
  }

  bannerImages() {
    const { BannerImages } = this.state;
    const classes = ["frameSlider", "helperSlider"];

    if (BannerImages) {
      return BannerImages.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            classes={classes}
            link={`/productDetails/${productId}`}
            key={productId}
          />
        </div>
      ));
    }

    /*let hotView = [];
    let counter = 0;
    this.state.BannerImages.map((item, key) => {
      hotView.push(
        <div className="column">
          <a href={"/productDetails/" + item.productId}>
            <div className="frameSlider">
              <span className="helperSlider">
                <img
                  src={
                    fileUrl +
                    "/upload/product/productImages/" +
                    item.productImage
                  }
                  alt=""
                />
              </span>
            </div>
          </a>
        </div>
      );

      counter++;
    });

    if (counter < 5) {
      for (let i = counter; i < 5; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameSlider">
                <span className="helperSlider">
                  <img src="/asche.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  hotDeal() {
    const { HotDeals } = this.state;
    const classes = ["frameHotDeal", "helperHotDeal"];

    if (HotDeals) {
      return HotDeals.map(({ productId, productImage }) => (
        <div>
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }

    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.HotDeals.map(item => {
        hotView.push(
          <div>
            <a href={"/productDetails/" + item.productId}>
              <div className="frameHotDeal">
                <span className="helperHotDeal">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt="productImage"
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 4) {
      for (let i = counter; i < 4; i++) {
        hotView.push(
          <div>
            <a target="__blank" href={"/productDetails/" + 103}>
              <div className="frameHotDeal">
                <span className="helperHotDeal">
                  <img src="/ppppp.jpg" alt="productImage" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  topSelections() {
    const { TopSelections } = this.state;
    const classes = ["frameTopSelection", "helperframeTopSelection"];

    if (TopSelections) {
      return TopSelections.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }

    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.TopSelections.map(item => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="frameTopSelection">
                <span className="helperframeTopSelection">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt="productImage"
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 4) {
      for (let i = counter; i < 4; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameTopSelection">
                <span className="helperframeTopSelection">
                  <img src="/ppppp.jpg" alt="productImage" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  newForYou() {
    const { NewForYou } = this.state;
    const classes = ["frameTopSelection", "helperframeTopSelection"];

    if (NewForYou) {
      return NewForYou.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }

    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.NewForYou.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="frameTopSelection">
                <span className="helperframeTopSelection">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt=""
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 4) {
      for (let i = counter; i < 4; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameTopSelection">
                <span className="helperframeTopSelection">
                  <img src="/ppppp.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  topSelectionBig() {
    const { FeaturedBrands } = this.state;
    const classes = ["frameFeatureBand", "helperframeFeatureBand"];

    if (FeaturedBrands) {
      return FeaturedBrands.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }

    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.FeaturedBrands.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="frameFeatureBand">
                <span className="helperframeFeatureBand">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt=""
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 2) {
      for (let i = counter; i < 2; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameFeatureBand">
                <span className="helperframeFeatureBand">
                  <img src="/asche.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  storeWillLove() {
    const { StoreWIllLove } = this.state;
    const classes = ["frameFeatureBand", "helperframeFeatureBand"];

    if (StoreWIllLove) {
      return StoreWIllLove.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }
    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.StoreWIllLove.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="frameFeatureBand">
                <span className="helperframeFeatureBand">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt=""
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 2) {
      for (let i = counter; i < 2; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameFeatureBand">
                <span className="helperframeFeatureBand">
                  <img src="/asche.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }

    return hotView;*/
  }

  MoreMobile() {
    const { More } = this.state;
    const classes = ["moreCatDiv", "moreCatSpan"];
    if (More) {
      return More.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }
    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.More.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="moreCatDiv">
                <span className="moreCatSpan">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt=""
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 6) {
      for (let i = counter; i < 6; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="moreCatDiv">
                <span className="moreCatSpan">
                  <img src="/asche.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  MoreDesk() {
    const { More } = this.state;
    const classes = ["frameMore", "helperframeMore"];
    if (More) {
      return More.map(({ productId, productImage }) => (
        <div className="column">
          <CardToListProducts
            img_src={img_src + productImage}
            link={`/productDetails/${productId}`}
            classes={classes}
            key={productId}
          />
        </div>
      ));
    }
    /*let hotView = [];
    let counter = 0;
    if (counter === 0) {
      this.state.More.map((item, key) => {
        hotView.push(
          <div className="column">
            <a href={"/productDetails/" + item.productId}>
              <div className="frameMore">
                <span className="helperframeMore">
                  <img
                    src={
                      fileUrl +
                      "/upload/product/productImages/" +
                      item.productImage
                    }
                    alt=""
                  />
                </span>
              </div>
            </a>
          </div>
        );
        counter++;
      });
    }

    if (counter < 6) {
      for (let i = counter; i < 6; i++) {
        hotView.push(
          <div className="column">
            <a href="http://banijjo.com.bd/productDetails/48">
              <div className="frameMore">
                <span className="helperframeMore">
                  <img src="/asche.jpg" alt="" />
                </span>
              </div>
            </a>
          </div>
        );
      }
    }
    return hotView;*/
  }

  render() {
    const options = {
      items: 5,
      rewind: true,
      autoplay: true,
      slideBy: 1,
      loop: true
    };
    return (
      <div>
        <br />
        <Breadcums />
        <div className="row">
          <Categories somProp={this.state.Categories} />

          <div className="medium-6 columns">
            <div className="container">
              <div
                className="row"
                style={{ marginLeft: "-30px", marginRight: "-30px" }}
              >
                <div className="col-md-6" style={{ marginTop: "5px" }}>
                  <CarouselSliderMainBanner
                    bannerImagesCustom={this.state.BannerImagesCustom}
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <p className="gap"></p>
            </div>

            <div className="row small-up-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-6">
                    <CarouselSliderBannerImgs
                      bannerImages={this.state.BannerImages}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="medium-3 large-3 columns adspos">
            <p align="center" style={{ color: "#009345", fontSize: 14 }}>
              Welcome
            </p>
            <p>
              <img
                style={{ height: 90, width: 300 }}
                src="/image/banijjoLogo.png"
                alt="company logo"
              />
            </p>
            <p
              style={{
                color: "#ec1c24",
                fontSize: "14px",
                textAlign: "center"
              }}
            >
              <strong style={{ color: "#ec1c24", fontWeight: "normal" }}>
                One Account
              </strong>
              <br />
              <strong style={{ color: "#009345", fontWeight: "normal" }}>
                All of Banijjo
              </strong>
            </p>

            <div className="row">
              <div className="small-12 columns">
                <input
                  style={{ height: 22 }}
                  type="text"
                  id="middle-label"
                  placeholder="Enter Your Mobile or Phone"
                />
              </div>
            </div>
            <a
              href="#"
              className="button large expanded"
              style={{ backgroundColor: "#009345", fontSize: 12 }}
            >
              Next
            </a>
            <p style={{ fontSize: 12 }}>Or Sign Up with</p>
            <p>
              <a href="#" className="fb btn" style={{ fontSize: 12 }}>
                <i className="fa fa-facebook fa-fw"></i> Login with Facebook
              </a>
            </p>
            <p>
              {" "}
              <a style={{ fontSize: 12 }} href="#" className="google btn">
                <i className="fa fa-google fa-fw"></i> Login with Google+
              </a>
            </p>
          </div>
        </div>

        <div className="row">
          <div className="row column"></div>
          <div className="medium-12 columns">
            <h5 style={{ margin: 0 }} className="text-left">
              {this.state.HotDealsTitle}
            </h5>
            <div className="row small-up-5">
              <div className="container">
                <div className="row">
                  <div className="col-md-12">
                    <OwlCarousel className="owl-theme" margin={10} {...options}>
                      {this.hotDeal()}
                    </OwlCarousel>
                  </div>
                  <p className="gap">&nbsp;</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="medium-6 columns">
            <h5 style={{ margin: "0" }} className="text-left">
              {this.state.TopSelectionsTitle}
              <a href="/featureproducts/2">
                <span
                  style={{ float: "right", color: "#009345", fontSize: "14px" }}
                >
                  See more
                </span>
              </a>{" "}
            </h5>
            <div className="row small-up-4">{this.topSelections()}</div>
          </div>

          <div className="medium-6 columns">
            <h5 style={{ margin: "0" }} className="text-left">
              {this.state.NewForYouTitle}
              <a href="/featureproducts/3">
                <span
                  style={{ float: "right", color: "#009345", fontSize: "14px" }}
                >
                  See more
                </span>
              </a>
            </h5>
            <div className="row small-up-4">{this.newForYou()}</div>
          </div>
        </div>
        <div className="row">
          <div className="row column">
            <p>&nbsp;</p>
          </div>
          <div className="medium-6 columns">
            <h5 style={{ margin: "0" }} className="text-left">
              {this.state.FeaturedBrandsTitle}
              <a href="/featureproducts/4">
                <span
                  style={{ float: "right", color: "#009345", fontSize: "14px" }}
                >
                  See more
                </span>
              </a>
            </h5>
            <div className="row small-up-2">{this.topSelectionBig()}</div>
          </div>
          <div className="medium-6 columns">
            <h5 style={{ margin: "0" }} className="text-left">
              {this.state.StoreWIllLoveTitle}

              <a href="/featureproducts/7">
                <span
                  style={{ float: "right", color: "#009345", fontSize: "14px" }}
                >
                  See more
                </span>
              </a>
            </h5>
            <div className="row small-up-2">{this.storeWillLove()}</div>
          </div>
        </div>

        {this.state.featuredCategories &&
          this.state.featuredCategories.map(
            ({ parent, childs, lastChilds }) =>
              parent !== null && (
                <div className="row" key={parent.category_id}>
                  <div className="row column">
                    <p>&nbsp;</p>
                  </div>
                  <h5
                    style={{ margin: "0", paddingLeft: "15px" }}
                    className="text-left"
                  >
                    Featured Categories
                  </h5>
                  <div className="medium-3 columns">
                    <div className="row">
                      <div className="medium-2 columns">
                        <p className="gap">&nbsp;</p>
                        <p>&nbsp;</p>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: -30 }}>
                      <div className="medium-8 columns">
                        <CardToListProducts
                          classes={["frameFeatureCat", "helperframeFeatureCat"]}
                          img_src={img_src + parent.home_image}
                          link={link + parent.category_id}
                        />
                        {/*<a href={"/productList/" + parent.category_id}>
                          <div className="frameFeatureCat">
                            <span className="helperframeFeatureCat">
                              <img
                                src={
                                  fileUrl +
                                  "/upload/product/productImages/" +
                                  parent.home_image
                                }
                                alt="Img"
                              />
                            </span>
                          </div>
                        </a>*/}
                      </div>
                      <p className="gap"></p>

                      {childs.map(
                        item =>
                          item.category_id !== null && (
                            <div
                              className="medium-4 columns"
                              key={item.category_id}
                            >
                              <div className="row">
                                <div
                                  className="columns small-6 large-12 featureCatsmOne"
                                  style={{ marginTop: "-20px" }}
                                >
                                  <CardToListProducts
                                    classes={[
                                      "frameFeatureCatSm",
                                      "helperframeFeatureCatSm"
                                    ]}
                                    img_src={img_src + item.home_image}
                                    link={link + item.category_id}
                                  />
                                  {/*<a href={`/productList/${item.category_id}`}>
                                    <div className="frameFeatureCatSm">
                                      <span className="helperframeFeatureCatSm">
                                        <img
                                          src={`${fileUrl}/upload/product/productImages/${item.home_image}`}
                                          alt="Img"
                                        />
                                      </span>
                                    </div>
                                  </a>*/}
                                </div>
                                <p className="gap">&nbsp;</p>
                              </div>
                            </div>
                          )
                      )}
                      <div className="medium-4 columns"></div>
                    </div>
                  </div>

                  {lastChilds.map(({ gc1, gc2 }, index) => (
                    <div
                      className="medium-3 columns"
                      style={{ paddingLeft: "15px" }}
                    >
                      {gc1.length ? (
                        <div className="row">
                          <h5>
                            &nbsp;&nbsp;&nbsp;Sub category
                            <a href={`/productList/${gc1[index].category_id}`}>
                              <span
                                style={{
                                  float: "right",
                                  color: "#009345",
                                  fontSize: "14px",
                                  paddingRight: "5px"
                                }}
                              >
                                See more
                              </span>
                            </a>
                          </h5>
                          {gc1.map(({ category_id, home_image }) => (
                            <div
                              className="small-4 large-4 columns"
                              key={category_id}
                            >
                              <FeaturedCategoryImg
                                id={category_id}
                                img={home_image}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                      <br />
                      {gc2.length ? (
                        <div className="row">
                          <h5>
                            &nbsp;&nbsp;&nbsp;Sub category
                            <a href={`/productList/${gc2[index].category_id}`}>
                              <span
                                style={{
                                  float: "right",
                                  color: "#009345",
                                  fontSize: "14px",
                                  paddingRight: "15px"
                                }}
                              >
                                See more
                              </span>
                            </a>
                          </h5>
                          {gc2.map(({ category_id, home_image }) => (
                            <div
                              className="small-4 large-4 columns"
                              key={category_id}
                            >
                              <FeaturedCategoryImg
                                id={category_id}
                                img={home_image}
                              />
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )
          )}

        <div className="row">
          <div className="medium-12 columns">
            <h5 style={{ margin: "0" }} className="text-left">
              {this.state.MoreTitle}
            </h5>
            <div className="row small-up-3 moreCat">{this.MoreMobile()}</div>

            <div className="row small-up-6 desview">{this.MoreDesk()}</div>
            <div className="row column">&nbsp;</div>
          </div>
        </div>

        <div
          className="modal"
          id="image-gallery"
          tabIndex="-1"
          role="dialog"
          aria-hidden="false"
          style={{ backgroundColor: "rgba(0, 0, 0, .9)" }}
        >
          <div className="modal-dialog modalDialogTop" role="document">
            <div className="modal-content">
              <div
                className="modal-body"
                style={{
                  position: "relative",
                  padding: "0px",
                  marginTop: "-36px"
                }}
              >
                <button
                  type="button"
                  className="close campaign-modal-close-btn"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <i
                    className="fa fa-times-circle"
                    style={{
                      fontSize: "24px",
                      color: "#ffffff"
                    }}
                  ></i>
                </button>
                <img
                  className="img-responsive"
                  src={fileUrl + "/upload/product/productImages/asche.jpg"}
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div id="boxes">
          <div id="dialog" className="window">
            {/* <img src={fileUrl + "/upload/product/productImages/" + this.state.Advertisement} alt="Advert" className="adsBigImage" /> */}

            <div className="frameAdsBig">
              <span className="helperAdsBig">
                <img
                  src={
                    fileUrl +
                    "/upload/product/productImages/" +
                    this.state.Advertisement
                  }
                  alt="Advert"
                />
              </span>
            </div>

            <div id="popupfoot">
              <button
                type="button"
                style={{ color: "#ffffff", marginBottom: "8px" }}
                className="btn-sm closeButton agree"
              >
                <i
                  className="fa fa-remove"
                  style={{
                    fontSize: "30px",
                    color: "#EC1624",
                    marginTop: "5px",
                    marginLeft: "-4px"
                  }}
                ></i>
              </button>
            </div>
          </div>
          <div id="mask"></div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default App;
