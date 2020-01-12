import React, { Component } from "react";

class RightSideBar extends Component {
  render() {
    return (
      <div className="medium-3 large-3 columns">
        <h4 align="center" style={{ color: "#5392C2" }}>
          Welcome
        </h4>
        <p>
          <img src="/banijjoLogo.jpg" alt="Banijjo logo" />
        </p>

        <div className="row">
          <div className="small-12 columns">
            <input
              type="text"
              id="middle-label"
              placeholder="Enter Your Mobile or Phone"
            />
          </div>
        </div>
        <a href="#" className="button large expanded">
          Next
        </a>
        <h5>Or Sign Up with</h5>
        <p>
          <a href="#" className="fb btn">
            <i className="fa fa-facebook fa-fw"></i> Login with Facebook
          </a>
        </p>
        <p>
          {" "}
          <a href="#" className="google btn">
            <i className="fa fa-google fa-fw"></i> Login with Google+
          </a>
        </p>
      </div>
    );
  }
}

export default RightSideBar;
