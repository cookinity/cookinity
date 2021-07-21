import React from 'react';
import './Footer.scss';
import logo from './Navbar/CookinityLogo.png';
import name from './Navbar/Cookinity.png';

const Footer = () => (
  <footer className="footer bg-primary text-white">
    <div className="container">
      <div className="row mt-4">
        <div className="col-xl-3 mb-3 mb-xl-0">
          <img src={logo} height="30" className="mb-3" alt="Spaces logo" />{' '}
          <img src={name} height="30" className="mb-3" alt="Spaces logo" />
        </div>
        <div className="col-6 col-xl-2 mb-5 mb-xl-0">
          <span className="h5">About</span>
          <ul className="footer-links mt-2">
            <li>
              <a target="_blank" href="http://localhost:3000/howcookinityworks">
                How Cookinity works
              </a>
            </li>
            <li>
              <a target="_blank" href="TODO">
                About Us
              </a>
            </li>
            <li>
              <a target="_blank" href="TODO">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div className="col-6 col-xl-3 mb-5 mb-xl-0">
          <span className="h5">Legal</span>
          <ul className="footer-links mt-2">
            <li>
              <a href="TODO">Privacy</a>
            </li>
            <li>
              <a target="_blank" href="TODO">
                Terms
              </a>
            </li>
          </ul>
        </div>
        <div className="col-12 col-xl-4 mb-5 mb-xl-0">
          <span className="h5">Get the app</span>
          <p></p>
          <form action="http://localhost:3000/comingsoon">
            <button className="btn btn-sm btn-white mb-xl-0 mr-2 mr-lg-2">
              <span className="d-flex align-items-center">
                <span className="icon icon-brand mr-2">
                  <span className="fa fa-apple"></span>
                </span>
                <span className="d-inline-block text-left">
                  <small className="font-weight-normal d-block">Available on</small> App Store
                </span>
              </span>
            </button>
          </form>
        </div>
      </div>
      <br></br>
      <div className="row">
        <div className="col mb-5 mb-xl-00 ">
          <div className="d-flex justify-content-center">
            <img src={logo} height="25" className="mb-3 " alt="Cookinity Logo" />
          </div>
          <div
            className="d-flex text-center justify-content-center align-items-center"
            role="contentinfo"
          >
            <p className="font-weight-normal font-small mb-0">
              © <span className="current-year">2021</span> Cookinity, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
