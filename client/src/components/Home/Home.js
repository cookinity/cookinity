import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row, Button } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Filters from './Filters';
import Loader from 'components/Shared/Loader/Loader';
import { CLASS_CATEGORIES } from 'constants/ClassCategories';
import { CITY_CATEGORIES } from 'constants/CityCategories';
import DatePicker from 'react-multi-date-picker';
import './Home.scss';

export const Home = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [cat, setCat] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchClasses(limit, skip);
  }, [skip, limit]);

  const fetchClasses = async (limit, skip) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await axios(`/api/classes?limit=${limit}&skip=${skip}${queryString}`);
      setClasses(result.data.classes);
      setFilteredClasses(result.data.classes);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  const nextPage = () => {
    setSkip(skip + limit);
  };

  const previousPage = () => {
    if (skip >= limit) setSkip(skip - limit);
  };

  const handleFilterCategory = async (e) => {
    let value = e.target.value;
    setQueryString(queryString.concat(`&category=${value}`));
    setCat(value);
  };

  const handleFilterCategory2 = async (e) => {
    let value = e.target.value;
    let result = [];
    result = classes.filter((data) => {
      return data.category.search(value) !== -1;
    });
    filteredClasses.concat(result);
    setFilteredClasses(filteredClasses);
  };

  const handleFilterCity = (e) => {
    let value = e.target.value;
    setQueryString(queryString.concat(`&city=${value}`));
    setCity(value);
  };

  const handleFilterDate = (e) => {
    e.format('YYYY-MM-DD');
    setQueryString(queryString.concat(`&date=${e}`));
    setStartDate(e);
  };

  const openNav = () => {
    document.getElementById('sidebar').style.width = '20%';
    document.getElementById('main').style.width = '65%';
  };

  const closeNav = () => {
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('main').style.width = '100%';
  };

  const rangeValue = () => {
    document.getElementById('amount')['value'] = document.getElementById('customRange')['value'];
  };

  const rangeSlider = () => {
    document.getElementById('customRange')['value'] = document.getElementById('amount')['value'];
  };

  //Darstellung aller Kurse ohne Filter
  const classCards = filteredClasses.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <ClassCard c={c} key={c.id}></ClassCard>
      </Col>
    );
  });

  if (isLoading) {
    return (
      <Layout>
        <Loader></Loader>
      </Layout>
    );
  } else {
    return (
      <div>
        <div id="sidebar" className="sidebar">
          <a href="javascript:void(0)" className="closebtn" onClick={closeNav}>
            &times;
          </a>
          <a>
            <h5>Filters</h5>
          </a>

          <a>
            <label htmlFor="averageRating" className="form-label">
              Average rating
            </label>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
          </a>
          <br></br>
          <a>
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => console.log('clicked!')}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
              </div>
            </li>
          </a>
          <br></br>
          <a>
            <label htmlFor="customRange" className="form-label">
              Capacity
            </label>
            <div className="row col-auto">
              <label>1</label>
              <input
                type="range"
                id="customRange"
                min="1"
                max="10"
                step="1"
                onChange={rangeValue}
              />
              <label>10</label>
              <input
                placeholder="Number of persons"
                id="amount"
                type="text"
                className="form-control"
                disabled
                onChange={rangeSlider}
              />
            </div>
          </a>
          <br></br>
          <a>Filter4</a>
        </div>

        <Layout>
          <div id="main" className="container">
            <div className="mt-2">
              {isError && (
                <Alert
                  variant="danger"
                  onClose={() => {
                    setIsError(false);
                    setErrorMessage('');
                  }}
                  dismissible
                >
                  {' '}
                  {errorMessage}
                </Alert>
              )}

              <div className="filter">
                <Filters
                  options={CLASS_CATEGORIES}
                  prompt="Select category"
                  fun={(event) => handleFilterCategory(event)}
                  name="Category:   "
                />

                <Filters
                  options={CITY_CATEGORIES}
                  prompt="Select city"
                  fun={(event) => handleFilterCity(event)}
                  name="City:"
                />

                <div className="form-group row">
                  <label htmlFor="datePicker" className="col-sm-2 col-form-label">
                    Date:
                  </label>
                  <div className="col-sm-10">
                    <DatePicker
                      style={{
                        width: '100%',
                        height: '36px',
                      }}
                      containerStyle={{
                        width: '100%',
                      }}
                      calendarPosition="bottom-center"
                      type="input-icon"
                      id="datePicker"
                      onChange={(e) => {
                        handleFilterDate(e);
                      }}
                      placeholder="Select date"
                    />
                  </div>
                </div>
              </div>

              <div className="btn-group" role="group">
                <Button className="mx-auto" onClick={fetchClasses}>
                  Search
                </Button>
                <br></br>
                <Button onClick={openNav}>Refine your search</Button>
              </div>

              <p></p>
              <Row> {classCards} </Row>
              <label htmlFor=""></label>

              <div className="btn-group" role="group">
                <Button onClick={previousPage}>Previos Page</Button>
                <Button onClick={nextPage}> Next Page</Button>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    );
  }
};
