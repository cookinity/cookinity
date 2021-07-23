import React from 'react';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import profile1 from './christina.png';
import profile2 from './joe.png';
import profile3 from './johannes.png';
import profile4 from './stefan.png';
import food from './food.png';
import './AboutUs.scss'

const AboutUs = () => {
  return (
    <LayoutNarrow>
      <div
        className="section section-image bg-primary overlay-primary text-white overflow-hidden pb-6 bRadius"
        style={{ backgroundImage: `url(${food})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
      >
        <div className="container z-2">
          <div className="row justify-content-center pt-3" >
            <div className="col-12 text-center">
              <h1 className="mb-4">Cookinity</h1>
            </div>
          </div>
        </div>
      </div>
      <div className=" pt-5">
        <div className="container">
          <div className="row">
            <p>
              <span className="font-weight-bold">Cookinity</span> is the project created by four
              innovative Information Systems students as part of the Master Course: Web Application
              Engineering at Technical University of Munich. The main intention is to connect
              cooking to authenticity and enhance personal communication.
            </p>
            <p>
              Individuals who are willing to share their cooking experience, regardless of their
              professional expertise, can become cooking class hosts. Anyone can learn to cook,
              regardless of his or her cooking experience, from the cooking class hosts.
            </p>
            <p>The main benefits of our platform are:</p>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card card-body bg-soft border-light p-2">
              <div className="card-group bg-soft">
                <div className="card mb-0">
                  <div className="card-body text-center px-0 px-md-3">
                    <div className="icon icon-secondary">
                      <span className="fa fa-calendar"></span>
                    </div>
                    <div className="h5 mt-3 mb-0">Bookable dates</div>
                    <span className="text-muted h6 font-weight-normal mb-0">Every day</span>
                  </div>
                </div>
                <div className="card mb-0 border-left">
                  <div className="card-body text-center px-0 px-md-3">
                    <div className="icon icon-secondary">
                      <span className="fa fa-users"></span>
                    </div>
                    <div className="h5 mt-3 mb-0">Capacity</div>
                    <span className="text-muted h6 font-weight-normal mb-0">Flexible choice</span>
                  </div>
                </div>
                <div className="card mb-0 border-left">
                  <div className="card-body text-center px-0 px-md-3">
                    <div className="icon icon-secondary">
                      <span className="fa fa-star"></span>
                    </div>
                    <div className="h5 mt-3 mb-0">Rating system</div>
                    <span className="text-muted h6 font-weight-normal mb-0">
                      For guests and hosts
                    </span>
                  </div>
                </div>
                <div className="card mb-0 border-left">
                  <div className="card-body text-center px-0 px-md-3">
                    <div className="icon icon-secondary">
                      <span className="fa fa-home"></span>
                    </div>
                    <div className="h5 mt-3 mb-0">Private setting</div>
                    <span className="text-muted h6 font-weight-normal mb-0">Host's home</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <h5 className="font-weight-normal">Cookinity Creators</h5>
        <div className="card border-light">

          <div className="media d-flex align-items-center my-3">

            <div className="card-body text-center px-0 px-md-3">
              <img className="img-fluid rounded" width="80" height="60" src={profile1} />{' '}
              <div>Christina Deutsch</div>
            </div>
            <div className="card-body text-center px-0 px-md-3">
              <img className="img-fluid rounded" width="80" height="60" src={profile2} />
              <div>Joe Yu</div>{' '}
            </div>
            <div className="card-body text-center px-0 px-md-3">
              <img className="img-fluid rounded" width="80" height="60" src={profile3} />
              <div>Johannes Schmidt</div>{' '}
            </div>
            <div className="card-body text-center px-0 px-md-3">
              <img className="img-fluid rounded" width="80" height="60" src={profile4} />
              <div>Stefan Waldhauser</div>{' '}
            </div>
          </div>
        </div>
      </div>
    </LayoutNarrow>
  );
};

export default AboutUs;
