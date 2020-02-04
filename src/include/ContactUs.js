import React, { Fragment } from 'react';
import Footer from './footer';
import '../assets/contactUs.css';

const marginBottom = { marginBottom: '20px' };

const ContactUs = () => {
  return (
    <Fragment>
      <Fragment>
        <div className="row">
          <p className="gap">&nbsp;</p>
        </div>
        <p className="gap">{''}</p>
        <div className="contactMap" style={{ marginTop: '35px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14605.88690770744!2d90.36374143036696!3d23.766210653303634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8968a250d73%3A0x8f874ef58c652d1a!2sbanijjo.com!5e0!3m2!1sen!2sbd!4v1580383181324!5m2!1sen!2sbd"
            width="100%"
            height="550px"
            frameBorder="0"
            style={{ border: '3px solid #ccc' }}
            allowFullScreen=""
            title="googleMap"
          >
            {''}
          </iframe>
        </div>
        <div className="row" id="contatti">
          <div className="container">
            <div className="row">
              <h2 className="font-weight-bold text-white" align="center">
                Contact Us
              </h2>
            </div>
            <div className="row" style={{ height: '550px', marginTop: '10px' }}>
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
                        >
                          {''}
                        </textarea>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <button
                        className="btn btn-primary"
                        type="submit"
                        style={{ backgroundColor: '#009345' }}
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
                        <span>164/A Shahjahan Rd, Dhaka 1207</span>
                      </div>
                    </div>
                    <div className="col-md-12" style={marginBottom}>
                      <div className="email-left">
                        <i
                          className="fa fa-envelope-open"
                          style={{ fontSize: '10px' }}
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
                      <a href="https://www.facebook.com/banijjo/">
                        <i
                          id="social-fb"
                          className="fa fa-facebook-square fa-3x socialFooter"
                          style={{ color: '#3b5998' }}
                        >
                          {''}
                        </i>
                      </a>
                      <a href="https://twitter.com/banijjo">
                        <i
                          id="social-tw"
                          className="fa fa-twitter-square fa-3x socialFooter"
                          style={{ color: '#26a7de' }}
                        >
                          {''}
                        </i>
                      </a>
                      <a href="https://www.linkedin.com/showcase/banijjo.com">
                        <i
                          id="social-gp"
                          className="fa fa-linkedin-square fa-3x socialFooter"
                          style={{ color: '#0e76a8' }}
                        >
                          {''}
                        </i>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>&nbsp;</p>
      </Fragment>

      <Footer />
    </Fragment>
  );
};

export default ContactUs;
