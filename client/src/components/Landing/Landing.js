import React, { useState } from 'react';
import Layout from 'components/Layout/Layout';
import Footer from 'components/Layout/Footer';

import { Col, Row } from 'react-bootstrap';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FilterBar from 'components/Home/FilterBar';
import munich from './munich.png';
import berlin from './berlin.png';
import dresden from './dresden.png';
import hamburg from './hamburg.png';
import soup from './soup.png';
import price from './best-price.png';
import rating from './rating.png';
import { Link, useHistory } from 'react-router-dom';

dayjs.extend(utc);

export const Landing = () => {
  const [startDate, setStartDate] = useState(undefined);
  const [cat, setCat] = useState(undefined);
  const [city, setCity] = useState(undefined);

  const history = useHistory();

  const navigateToHome = () => {
    history.push('/home', { categoryFilter: cat, cityFilter: city, dateFilter: startDate });
  };

  const handleFilterCategory = (e) => {
    let value = e.target.value;
    if (value === 'All Categories') {
      setCat(undefined);
    } else {
      setCat(value);
    }
  };

  const handleFilterCity = (e) => {
    let value = e.target.value;
    if (value === 'All Cities') {
      setCity(undefined);
    } else {
      setCity(value);
    }
  };

  const handleFilterDate = (date) => {
    setStartDate(date);
  };

  return (
    <div>
      <Layout>
        <section className="pb-0">
          <div className="container section-image overlay-soft text-dark rounded px-lg-5 py-6 position-relative border border-light shadow-sm">
            <div className="row no-gutters justify-content-between align-items-center">
              <div className="col-12 order-lg-2">
                <h1 className="h2 mb-4">Find authentic cooking classes nearby</h1>
                <div>
                  <Row className="mb-4">
                    <Col>
                      <FilterBar
                        city={city}
                        category={cat}
                        handleFilterCity={handleFilterCity}
                        handleFilterCategory={handleFilterCategory}
                        handleFilterDate={handleFilterDate}
                        startDate={startDate}
                        onSearchHandler={navigateToHome}
                      ></FilterBar>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
              <br></br>
              <br></br>
              <br></br>
              <img className="img-fluid image-lg mb-4" src={soup} />
              <h2 className="h4">No cooking experience required</h2>
              <p>
                Our hosts are happy to have you as guest even if you do not have any cooking
                experience.
              </p>
            </div>
            <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
              <br></br>
              <br></br>
              <br></br>
              <img className="img-fluid image-lg mb-4" src={rating} />
              <h2 className="h4">Truly transparent</h2>
              <p>
                We have a rating system in both directions: from hosts to guests and from guests to
                hosts.
              </p>
            </div>
            <div className="col-12 col-sm-6 col-md-4 text-center mb-4 mb-md-0 px-lg-4">
              <br></br>
              <br></br>
              <br></br>
              <img className="img-fluid image-lg mb-4" src={price} />
              <h2 className="h4">Best prices</h2>
              <p>We offer you classes at a lower price than in a professional cooking school.</p>
            </div>
          </div>

          <div className="row mt-6">
            <div className="col-12">
              <h3 className="h4 mb-5">Top Cities</h3>
            </div>
            <div className="col-12 col-sm-6 col-lg-3 mb-4 mb-lg-0">
              <Link
                className="card img-card fh-400 border-0 outer-bg"
                data-background-inner={munich}
                to={{
                  pathname: '/home',
                  state: { cityFilter: 'Munich' },
                }}
              >
                <div
                  className="inner-bg overlay-dark"
                  style={{ backgroundImage: `url(${munich})` }}
                ></div>
                <div className="card-img-overlay d-flex align-items-center">
                  <div className="card-body text-white p-3">
                    <h5 className="text-uppercase text-center">Munich</h5>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-12 col-sm-6 col-lg-3 mb-4 mb-lg-0">
              <Link
                className="card img-card fh-400 border-0 outer-bg"
                data-background-inner={berlin}
                to={{
                  pathname: '/home',
                  state: { cityFilter: 'Berlin' },
                }}
              >
                <div
                  className="inner-bg overlay-dark"
                  style={{ backgroundImage: `url(${berlin})` }}
                ></div>
                <div className="card-img-overlay d-flex align-items-center">
                  <div className="card-body text-white p-3">
                    <h5 className="text-uppercase text-center">Berlin</h5>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-4 mb-lg-0">
              <Link
                className="card img-card fh-400 border-0 outer-bg"
                data-background-inner={hamburg}
                to={{
                  pathname: '/home',
                  state: { cityFilter: 'Hamburg' },
                }}
              >
                <div
                  className="inner-bg overlay-dark"
                  style={{ backgroundImage: `url(${hamburg})` }}
                ></div>
                <div className="card-img-overlay d-flex align-items-center">
                  <div className="card-body text-white p-3">
                    <h5 className="text-uppercase text-center">Hamburg</h5>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-12 col-sm-6 col-lg-3 mb-4 mb-lg-0">
              <Link
                className="card img-card fh-400 border-0 outer-bg"
                data-background-inner={dresden}
                to={{
                  pathname: '/home',
                  state: { cityFilter: 'Dresden' },
                }}
              >
                <div
                  className="inner-bg overlay-dark"
                  style={{ backgroundImage: `url(${dresden})` }}
                ></div>
                <div className="card-img-overlay d-flex align-items-center">
                  <div className="card-body text-white p-3">
                    <h5 className="text-uppercase text-center">Dresden</h5>
                  </div>
                </div>
              </Link>
            </div>
          </div>
          <br></br>
          <br></br>
        </section>
      </Layout>
      <Footer></Footer>
    </div>
  );
};

export default Landing;
