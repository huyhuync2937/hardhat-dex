import React from "react";

const Footer = () => {
  return (
    <div className="footer" style={{ backgroundImage: "url('../public/assets/img/footer-bg.png')" }}>
      <div className="container">
        <div className="row">
          <div className="col-12 wow fadeInUp">
            <div className="top-footer">
              <div className="logo">
                <img src="../public/assets/img/logo.png" />
              </div>
              <a href="" className="button-1">Get in touch</a>
            </div>
          </div>
        </div>
        <div className="row justify-content-between">
          <div className="col-lg-2 col-md-6 wow fadeInUp">
            <div className="footer-box">
              <h4 className="lastead">Company</h4>
              <ul className="footer-link">
                {["About Us", "Conatct Us", "Blog", "Affiliate"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="">{item}</a>
                    </li>
                  )
                )}
                <li></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 wow fadeInUp">
            <div className="footer-box">
              <h4 className="lastead">Support</h4>
              <ul className="footer-link">
                {["FAQ", "Conatct Time", "How it work", "Detail"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="">{item}</a>
                    </li>
                  )
                )}
                <li></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 wow fadeInUp">
            <div className="footer-box">
              <h4 className="lastead">Policy</h4>
              <ul className="footer-link">
                {["Term of use", "Privacy Policy", "Refunds Policy", "Money type"].map(
                  (item, index) => (
                    <li key={index}>
                      <a href="">{item}</a>
                    </li>
                  )
                )}
                <li></li>
              </ul>
            </div>
          </div>
          <div className="col-lg-5 col-md-6 wow fadeInUp">
            <div className="footer-box">
              <h4 className="lastead">Newsletter</h4>
              <form action="">
                <div className="form-group">
                  <input type="email" placeholder="Enter email address" />
                  <button type="submit" className="button-1">Join now</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
