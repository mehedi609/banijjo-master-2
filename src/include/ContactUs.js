import React, { Fragment } from "react";
import Navbar from "./Navbar";
import Footer from "./footer";
import "../assets/contactUs.css";

const ContactUs = () => {
  return (
    <Fragment>
      <Fragment>
        <div className="row">
          <p className="gap">&nbsp;</p>
        </div>
        <div className="row" id="contatti">
          <div className="container">
            <div className="row" style={{ height: "550px" }}>
              <div className="col-md-6 maps">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11880.492291371422!2d12.4922309!3d41.8902102!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x28f1c82e908503c4!2sColosseo!5e0!3m2!1sit!2sit!4v1524815927977"
                  frameBorder="0"
                  style={{ border: "3px solid #ccc" }}
                  allowFullScreen
                ></iframe>
              </div>
              <div className="col-md-6">
                <h2 className="font-weight-bold text-white">Contract Us</h2>
                <form action="">
                  <div className="row">
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="subject"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-lg-6">
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
                          placeholder="Address"
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
                <br />
                <div className="text-white">
                  <h2 className="font-weight-bold">Banijjo.com</h2>
                  <i className="fa fa-phone mt-3"></i>{" "}
                  <a href="tel:+">(+39) 123456</a>
                  <br />
                  <i className="fa fa-phone mt-3"></i>{" "}
                  <a href="tel:+">(+39) 123456</a>
                  <br />
                  <i className="fa fa-envelope mt-3"></i>{" "}
                  <a href="">info@test.it</a>
                  <br />
                  <i className="fa fa-globe mt-3"></i> Piazza del Colosseo, 1,
                  00184 Roma
                  <br />
                  <i className="fa fa-globe mt-3"></i> Piazza del Colosseo, 1,
                  00184 Roma
                  <br />
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
