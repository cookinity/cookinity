import React from 'react';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import picture from './maintenance.png';

const ComingSoon = () => {
  return (
    <LayoutNarrow>
        <section className=" d-flex align-items-center justify-content-center">
          <div className="container">
            <div className="row d-flex align-items-center justify-content-between">
              <div className="col text-dark order-2 order-lg-1">
                <div>
                  <h1 className="display-2 mb-2">We're coming soon</h1>
                  <p className="lead mb-4">
                    This page is <span className="text-italic">under construction</span>.
                  </p>
                  <div className="form-group mt-2"></div>
                </div>
              </div>
              <div className="col col-12 col-sm-10 col-md-8 col-lg-6 my-6 my-lg-0 mx-auto order-1 order-lg-2 d-none d-sm-block">
                <img className="img-fluid" src={picture} alt="maintenance illustration" />
              </div>
            </div>
          </div>
        </section>
    
    </LayoutNarrow>
  );
};

export default ComingSoon;
