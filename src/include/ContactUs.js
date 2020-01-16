import React, { Fragment } from "react";
import Footer from "./footer";
import "../assets/contactUs.css";

const marginBottom = { marginBottom: "20px" };

const ContactUs = () => {
  return (
    <Fragment>
      <Fragment>
        <div className="row">
          <p className="gap">&nbsp;</p>
        </div>
        <p className="gap"></p>
        <div className="contactMap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11880.492291371422!2d12.4922309!3d41.8902102!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x28f1c82e908503c4!2sColosseo!5e0!3m2!1sit!2sit!4v1524815927977"
            width="100%"
            height="550px"
            frameBorder="0"
            style={{ border: "3px solid #ccc" }}
            allowFullScreen
          ></iframe>
        </div>
        <div className="row" id="contatti">
          <div className="container">
            <div className="row">
              <h2 className="font-weight-bold text-white" align="center">
                Contact Us
              </h2>
            </div>
            <div className="row" style={{ height: "550px", marginTop: "10px" }}>
              <div className="col-md-6">
                <form action="">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="subject"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-12">
                      <div className="form-group">
                        <input
                          type="number"
                          className="form-control"
                          placeholder="Telephone"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <textarea
                          className="form-control"
                          id="exampleFormControlTextarea1"
                          placeholder="Description"
                          rows="3"
                          required
                        ></textarea>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{ backgroundColor: "#009345" }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-md-2"></div>
              <p className="mobileGap"></p>
              <div className="col-md-4">
                <div className="text-white">
                  <div className="row contact-info">
                    <div className="col-md-12" style={marginBottom}>
                      <div className="email-left">
                        <i className="fa fa-map-marker"></i>
                      </div>
                      <div className="email-right">
                        <span>Demo Address</span>
                      </div>
                    </div>
                    <div className="col-md-12" style={marginBottom}>
                      <div className="email-left">
                        <i
                          className="fa fa-envelope-open"
                          style={{ fontSize: "10px" }}
                        ></i>
                      </div>
                      <div className="email-right">
                        <span>info@banijjo.com.bd</span>
                      </div>
                    </div>
                    <div className="col-md-12" style={marginBottom}>
                      <div className="email-left">
                        <i className="fa fa-volume-control-phone"></i>
                      </div>
                      <div className="email-right">
                        <span>09677-222 222</span>
                      </div>
                    </div>
                  </div>

                  <div className="my-4">
                    <p>
                      <a
                        href="https://www.facebook.com/banijjo/"
                        target="_blank"
                      >
                        <i
                          id="social-fb"
                          className="fa fa-facebook-square fa-3x socialFooter"
                          style={{ color: "#3b5998" }}
                        ></i>
                      </a>
                      <a href="#">
                        <i
                          id="social-tw"
                          className="fa fa-twitter-square fa-3x socialFooter"
                          style={{ color: "#26a7de" }}
                        ></i>
                      </a>
                      <a href="#">
                        <i
                          id="social-gp"
                          className="fa fa-linkedin-square fa-3x socialFooter"
                          style={{ color: "#0e76a8" }}
                        ></i>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>

      <Footer />
    </Fragment>
  );
};

export default ContactUs;