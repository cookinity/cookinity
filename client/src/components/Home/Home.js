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
  const [priceLow, setPriceLow] = useState('');
  const [priceUp, setPriceUp] = useState('');
  const [priceLowField, setPriceLowField] = useState('');
  const [priceUpField, setPriceUpField] = useState('');
  const [rating, setRating] = useState('');
  const [vegan, setVegan] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [nutAllergy, setNutAllergy] = useState(false);

  const starRating4 = document.getElementById('starRating4');
  const starRating3 = document.getElementById('starRating3');
  const starRating2 = document.getElementById('starRating2');
  const starRating1 = document.getElementById('starRating1');

  const priceUnder25 = document.getElementById('priceUnder25');
  const priceUnder50 = document.getElementById('priceUnder50');
  const priceUnder100 = document.getElementById('priceUnder100');
  const priceOver100 = document.getElementById('priceOver100');

  useEffect(() => {
    fetchClasses();
  }, [
    skip,
    limit,
    cat,
    city,
    startDate,
    priceLow && priceUp,
    guests,
    rating,
    vegan,
    vegetarian,
    nutAllergy,
  ]);

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
        priceLow,
        priceUp,
        priceLowField,
        priceUpField,
        rating,
        vegan,
        vegetarian,
        nutAllergy,
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

  const handleFilterCategory = (e) => {
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

  const clearCapacityFilter = () => {
    setGuests(undefined);
    document.getElementById('amount')['value'] = undefined;
    document.getElementById('customRange')['value'] = document.getElementById('amount')['value'];
  };

  const handleFilterPrice = (priceId, low, up) => {
    if (priceId.style.color != 'dodgerblue') {
      priceId.style.color = 'dodgerblue';
      var prices = [priceUnder25, priceUnder50, priceUnder100, priceOver100];
      for (var i = 0; i < prices.length; i++) {
        if (prices[i] != priceId) prices[i].style.color = 'black';
      }
      setPriceLow(low);
      setPriceUp(up);
    } else if (priceId.style.color == 'dodgerblue') {
      priceId.style.color = 'black';
      setPriceLow(undefined);
      setPriceUp(undefined);
    }
  };

  const handleFilterPriceMinField = (priceMin) => {
    setPriceLowField(priceMin);
  };

  const handleFilterPriceMaxField = (priceMax) => {
    setPriceUpField(priceMax);
  };

  const handleVegan = (e) => {
    if (e.target.checked) setVegan(true);
    else setVegan(false);
  };

  const handleVegetarian = (e) => {
    if (e.target.checked) setVegetarian(true);
    else setVegetarian(false);
  };

  const handleNutAllergy = (e) => {
    if (e.target.checked) setNutAllergy(true);
    else setNutAllergy(false);
  };

  const handleFilterRating = (starRating, e) => {
    if (starRating.style.color != 'dodgerblue') {
      starRating.style.color = 'dodgerblue';
      var ratings = [starRating1, starRating2, starRating3, starRating4];
      for (var i = 0; i < ratings.length; i++) {
        if (ratings[i] != starRating) ratings[i].style.color = 'black';
      }
      setRating(e);
    } else if (starRating.style.color == 'dodgerblue') {
      starRating.style.color = 'black';
      setRating(undefined);
    }
  };

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
        <ClassCard c={c} key={c.id}></ClassCard>
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
              Overall rating
            </label>

            <li
              id="starRating4"
              className="list-group pointer"
              onClick={() => handleFilterRating(starRating4, 4)}
            >
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <p className="small px-2">& More</p>
              </div>
            </li>
            <li
              id="starRating3"
              className="list-group pointer"
              onClick={() => handleFilterRating(starRating3, 3)}
            >
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <p className="small px-2">& More</p>
              </div>
            </li>
            <li
              id="starRating2"
              className="list-group pointer"
              onClick={() => handleFilterRating(starRating2, 2)}
            >
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <p className="small px-2">& More</p>
              </div>
            </li>
            <li
              id="starRating1"
              className="list-group pointer"
              onClick={() => handleFilterRating(starRating1, 1)}
            >
              <div className="row col-auto">
                <i className="fa fa-star text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <i className="fa fa-star-o text-warning"></i>
                <p className="small px-2">& More</p>
              </div>
            </li>
          </a>
          <a>
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <li
              id="priceUnder25"
              className="list-group pointer"
              onClick={() => handleFilterPrice(priceUnder25, 1, 25)}
            >
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <p className="small px-2">1 - 25€</p>
              </div>
            </li>
            <li
              id="priceUnder50"
              className="list-group pointer"
              onClick={() => handleFilterPrice(priceUnder50, 26, 50)}
            >
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">26 - 50€</p>
              </div>
            </li>
            <li
              id="priceUnder100"
              className="list-group pointer"
              onClick={() => handleFilterPrice(priceUnder100, 51, 100)}
            >
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">51 - 100€</p>
              </div>
            </li>
            <li
              id="priceOver100"
              className="list-group pointer"
              onClick={() => handleFilterPrice(priceOver100, 100, 1000)}
            >
              <div className="row col-auto">
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <i className="fa fa-eur"></i>
                <p className="small px-2">over 100€</p>
              </div>
            </li>
            <div className="row col-auto">
            <div className="d-flex ">
              <input
                placeholder="Min"
                type="number"
                className="form-control custom-width-min-max"
                min="1"
                max="1000"
                onChange={handleFilterPriceMinField}
              />
              <p className="px-2">-</p>
              <input
                placeholder="Max"
                type="number"
                className="form-control custom-width-min-max"
                min="1"
                max="1000"
                onChange={handleFilterPriceMaxField}
              />
            </div>
            <p>&nbsp;</p>
            <Button onClick={fetchClasses}>Go</Button>
            </div>
          </a>

          <a>
            <label htmlFor="customRange" className="form-label">
              Number of participants
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
              <p>&nbsp;</p>
              <div className="d-flex ">
                <input id="amount" type="number" className="form-control custom-width" disabled />
              </div>
              <Button onClick={clearCapacityFilter}>Clear</Button>
            </div>
          </a>

          <a>
            <label htmlFor="vegan" className="form-label">
              Dietary preference
            </label>
            <div className="form-check">
              <input
                className="form-check-input"
                onChange={(event) => handleVegan(event)}
                type="checkbox"
                id="vegan"
              />
              <label className="form-check-label small" htmlFor="vegan">
                Vegan
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                onChange={(event) => handleVegetarian(event)}
                type="checkbox"
                id="vegetarian"
              />
              <label className="form-check-label small" htmlFor="vegetarian">
                Vegetarian
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                onChange={(event) => handleNutAllergy(event)}
                type="checkbox"
                id="nutAllergy"
              />
              <label className="form-check-label small" htmlFor="nutAllergy">
                Nut free
              </label>
            </div>
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

              <div className="d-flex justify-content-center">
                <div className="filter">
                  <Filters
                    options={CLASS_CATEGORIES}
                    prompt="Select category"
                    fun={(event) => handleFilterCategory(event)}
                  />
                </div>
                <p>&nbsp;</p>
                <div className="filter">
                  <Filters
                    options={CITY_CATEGORIES}
                    prompt="Select city"
                    fun={(event) => handleFilterCity(event)}
                  />
                </div>
                <p>&nbsp;</p>
                <div className="filter">
                  <div className="form-group row">
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

                <Button onClick={openNav}>Add more filters</Button>
              </div>

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
