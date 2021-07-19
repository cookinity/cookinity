import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Col, Row } from 'react-bootstrap';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FilterBar from 'components/Home/FilterBar';
dayjs.extend(utc);

export const Landing = () => {
  const [startDate, setStartDate] = useState(undefined);
  const [cat, setCat] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [cat, city, startDate]);

  const fetchClasses = async () => {
    let date = undefined;
    if (startDate) {
      date = dayjs.utc(startDate.toDate()).format();
    }
    try {
      const queryObject = {
        city,
        category: cat,
        date,
      };

      const response = await axios.post(`/api/classes/query`, queryObject);
      // redirection to Home page
    } catch (err) {
      setErrorMessage(err?.response?.data.message || err.message);
    }
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
    <Layout>
      <main>
        <div
          className="preloader bg-dark flex-column justify-content-center align-items-center"
          style={{ display: 'none' }}
        ></div>
        <section className="section section-header pb-0">
          <div
            className="container section-image overlay-soft text-dark rounded px-lg-5 py-6 overflow-hidden position-relative border border-light shadow-sm"
            data-background="../assets/img/hero-2.jpg"
          >
            <div className="row no-gutters justify-content-between align-items-center">
              <div className="col-12 order-lg-2">
                <h1 className="h2 mb-4">Find cooking classes nearby</h1>
                <div>
                  <Row className="mb-4">
                    <Col>
                      <FilterBar
                        handleFilterCity={handleFilterCity}
                        handleFilterCategory={handleFilterCategory}
                        handleFilterDate={handleFilterDate}
                        startDate={startDate}
                        fetchClasses={fetchClasses}
                      ></FilterBar>
                    </Col>
                  </Row>
                </div>
                <ul className="list-unstyled mb-0 d-none d-md-flex">
                  <li className="mr-2">
                    <span className="font-weight-bold">Top Cities: Munich, Berlin, Hamburg</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
};
