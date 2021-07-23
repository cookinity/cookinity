import React from 'react';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import './HowCookinityWorks.scss'


const HowCookinityWorks = () => {
  return (
    <LayoutNarrow>
      <main>
        <section
          className="section section-header bg-primary overlay-primary text-white pb-8 pb-lg-10 bRadius"
          data-background="../assets/img/team-hero.jpg"
        >
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-8 text-center">
                <h1 className="display-2 mb-4">Cooking alone is boring</h1>
                <p className="lead mb-4 text-muted">
                Cookinity is a cooking class platform to help food lovers have an authentic culinary experience and improve their skills with the twist that cooking enthusiasts host the classes.
                </p>
              </div>
            </div>
          </div>
          <figure className="position-absolute bottom-0 left-0 w-100 d-none d-md-block mb-n2">
            <svg
              className="fill-white"
              enable-background="new 0 0 1504 131.3"
              viewBox="0 0 1504 131.3"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="m877.8 85c139.5 24.4 348 33.5 632.2-48.2-.2 32.5-.3 65-.5 97.4-505.9 0-1011.6 0-1517.5 0 0-33.3 0-66.7 0-100.1 54.2-11.4 129.5-23.9 220-28.2 91-4.3 173.6 1 307.4 18.6 183.2 24.2 295.2 49.4 358.4 60.5z"></path>
            </svg>
          </figure>
        </section>
        <section className="section section-lg">
          <div className="container">
            <div className="row">
              <div className="col-md-4 pr-lg-4">
                <h2 className="display-2 font-weight-light mb-5">
                  Let's talk about how <span className="font-weight-bold">Cookinity</span> works.
                </h2>
              </div>
              <div className="col-md-4">
                <p className="lead">
                  You want to host a cooking class? 
                  <br></br>
                  1. Register on <span className="font-weight-bold">Cookinity</span> website.
                  <br></br>
                  2. Navigate to <span className="font-italic">Host a Class</span> tab.
                  <br></br>
                  3. Create a Stripe account.
                  <br></br>
                  4. Fill out the form.
                  <br></br>
                  5. Wait for the guests to book your class.
                  <br></br>
                  That's all!
                </p>
              </div>
              <div className="col-md-4">
                <p className="lead">
                You want to book a cooking class? 
                  <br></br>
                  1. Register on <span className="font-weight-bold">Cookinity</span> website.
                  <br></br>
                  2. Navigate to <span className="font-italic">Home</span> tab.
                  <br></br>
                  3. Choose a class you like. Refine your search with filters.
                  <br></br>
                  4. Click on the selected class to book it.
                  <br></br>
                  5. Complete the booking procedure.
                  <br></br>
                  Meet your host and enjoy the class!
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </LayoutNarrow>
  );
};

export default HowCookinityWorks;
