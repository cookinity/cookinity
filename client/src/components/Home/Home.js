import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row, Button } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Filters from './Filters';
import Loader from 'components/Shared/Loader/Loader';
import { CLASS_CATEGORIES } from 'constants/ClassCategories';
import { CITY_CATEGORIES } from 'constants/CityCategories';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import './Home.scss';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
export const Home = () => {
  const [classes, setClasses] = useState([]);
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [limit, setLimit] = useState(1);
  const [skip, setSkip] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [cat, setCat] = useState('');
  const [city, setCity] = useState('');
  const [guests, setGuests] = useState('');
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => {
    fetchClasses();
  }, [skip, limit]);

  const fetchClasses = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      let date = undefined;
      if (startDate) {
        date = dayjs.utc(startDate.toDate()).format();
      }
      const queryObject = {
        skip,
        limit,
        city,
        category: cat,
        date,
        guests,
        price,
        rating,
      };

      const result = await axios.post(`/api/classes/query`, queryObject);
      setClasses(result.data.classes);
      setNumberOfEntries(result.data.numberOfEntries);
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
    setCat(value);
  };

  const handleFilterCity = (e) => {
    let value = e.target.value;
    setCity(value);
  };

  const handleFilterDate = (e) => {
    setStartDate(e);
  };

  const handleFilterCapacity = () => {
    document.getElementById('amount')['value'] = document.getElementById('customRange')['value'];
    setGuests(document.getElementById('customRange')['value']);
  };

  const handleFilterPrice = (e) => {
    setPrice(e);
  };

  const handleFilterRating = (e) => {
    setRating(e);
  }

  const openNav = () => {
    document.getElementById('sidebar').style.width = '20%';
    document.getElementById('main').style.width = '65%';
  };

  const closeNav = () => {
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('main').style.width = '100%';
  };

  // All classes
  const classCards = filteredClasses.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <ClassCard c={c} date={startDate} key={c.id}></ClassCard>
      </Col>
    );
  });

  return (
    <>
      <div style={{ display: isLoading ? 'block' : 'none' }}>
        <Layout>
          <Loader></Loader>
        </Layout>
      </div>
      <div style={{ display: isLoading ? 'none' : 'block' }}>
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

            <li className="list-group" onClick={() => handleFilterRating(5)}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterRating(4)}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterRating(3)}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterRating(2)}>
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterRating(1)}>
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
            <li className="list-group" onClick={() => handleFilterPrice(25)}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <p className="small px-2">under 25€</p>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterPrice(50)}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">under 50€</p>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterPrice(100)}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">under 100€</p>
              </div>
            </li>
            <li className="list-group" onClick={() => handleFilterPrice(250)}>
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">under 250€</p>
              </div>
            </li>
          </a>

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
                onChange={handleFilterCapacity}
              />
              <label>10</label>
              <input
                placeholder="Number of persons"
                id="amount"
                type="text"
                className="form-control custom-width"
                disabled
              />
            </div>
          </a>
          <br></br>
          <a>
            <Button className="mx-auto" onClick={fetchClasses}>
              Apply
            </Button>
          </a>
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
                      value={startDate}
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
                <Button onClick={previousPage} disabled={skip === 0 ? true : false}>
                  Previous Page
                </Button>
                <Button onClick={nextPage} disabled={skip >= numberOfEntries - 1 ? true : false}>
                  Next Page
                </Button>
              </div>
            </div>
          </div>
        </Layout>
      </div>
    </>
  );
};
