import React, { Component } from "react";

class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        <div className="row fullWidth column">
          <footer
            className="section footer-classic context-dark bg-image"
            style={{ background: "#6d6e70" }}
          >
            <div className="container">
              <div className="col-md-4">
                <h5 className="footerHeader" style={{ marginTop: "15px" }}>
                  About us
                </h5>
                <ul className="nav-list" style={{ paddingLeft: "10px" }}>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Cookie Policy</a>
                  </li>
                  <li>
                    <a href="#">Warranty Policy</a>
                  </li>
                  <li>
                    <a href="#">Shipping Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li>
                    <a href="#">Returns and Replacement</a>
                  </li>
                  <li>
                    <a href="#">FAQ</a>
                  </li>
                  <li className="liContractMob">
                    <a href="#">Contract us</a>
                  </li>
                </ul>
                <p class="socialNone">
                  <a href="https://www.facebook.com/banijjo/" target="_blank">
                    <i
                      id="social-fb"
                      className="fa fa-facebook-square fa-3x socialFooter"
                    ></i>
                  </a>
                  <a href="#">
                    <i
                      id="social-tw"
                      className="fa fa-twitter-square fa-3x socialFooter"
                    ></i>
                  </a>
                  <a href="#">
                    <i
                      id="social-gp"
                      className="fa fa-linkedin-square fa-3x socialFooter"
                    ></i>
                  </a>
                </p>
              </div>
              <div className="col-md-4 sCatFooter">
                <h5 className="footerHeader" style={{ marginTop: "15px" }}>
                  Special Category
                </h5>
                <ul className="nav-list" style={{ paddingLeft: "10px" }}>
                  <li>
                    <a href="#">Mens</a>
                  </li>
                  <li>
                    <a href="#">Jute Products</a>
                  </li>
                  <li>
                    <a href="#">Handicraft</a>
                  </li>
                  <li>
                    <a href="#">Leather Products</a>
                  </li>
                  <li>
                    <a href="#">Women</a>
                  </li>
                  <li>
                    <a href="#">Furniture</a>
                  </li>
                  <li>
                    <a href="#">Wooden Crafts</a>
                  </li>
                  <li>
                    <a href="#">Jewellary</a>
                  </li>
                </ul>
              </div>
              <div className="col-md-4 footerContract">
                <h5 className="footerHeader" style={{ marginTop: "15px" }}>
                  Contact us
                </h5>
                <ul className="nav-list" style={{ paddingLeft: "10px" }}>
                  <li>
                    <a href="/contactUs">Contact us</a>
                  </li>
                </ul>
                <p>
                  <a href="https://www.facebook.com/banijjo/" target="_blank">
                    <i
                      id="social-fb"
                      className="fa fa-facebook-square fa-3x socialFooter"
                    ></i>
                  </a>
                  <a href="#">
                    <i
                      id="social-tw"
                      className="fa fa-twitter-square fa-3x socialFooter"
                    ></i>
                  </a>
                  <a href="#">
                    <i
                      id="social-gp"
                      className="fa fa-linkedin-square fa-3x socialFooter"
                    ></i>
                  </a>
                </p>
              </div>
            </div>
          </footer>
        </div>

        <div className="row">
          <div className="container">
            <div className="col-md-6 copyRightFooterYear">
              <p style={{ fontSize: "14px" }}>
                {" "}
                ©️ 2010-2019{" "}
                <a href="http://banijjo.com.bd/" target="_blank">
                  banijjo.com.bd
                </a>{" "}
                All rights reserved.
              </p>
            </div>

            <div className="col-md-6 copyRightFooter">
              <p style={{ fontSize: "14px" }}>
                {" "}
                Design and Developed By
                <a href="http://www.ambalait.com/" target="_blank">
                  <img src="../image/ambala_it.png" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Footer;
