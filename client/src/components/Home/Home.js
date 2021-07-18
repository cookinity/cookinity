import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row, Button, Container } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Loader from 'components/Shared/Loader/Loader';

import './Home.scss';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FilterBar from './FilterBar';
import FilterSideBar from './FilterSideBar';
import ClassesMap from './ClassesMap';
dayjs.extend(utc);

export const Home = () => {
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);

  const [startDate, setStartDate] = useState(undefined);
  const [cat, setCat] = useState(undefined);
  const [city, setCity] = useState(undefined);
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

  const classCards = filteredClasses.map((c) => {
    return (
      <Col className="mb-1" sm={12} lg={4}>
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
        <Layout>
          <Row>
            <Col>
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
            </Col>
          </Row>
          <Row className="mb-2">
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
          <Row>
            <Col xs={6} lg={12} xl={1}>
              <FilterSideBar
                handleFilterRating={handleFilterRating}
                starRating4={starRating4}
                starRating3={starRating3}
                starRating2={starRating2}
                starRating1={starRating1}
                handleFilterPrice={handleFilterPrice}
                priceUnder25={priceUnder25}
                priceUnder50={priceUnder50}
                priceUnder100={priceUnder100}
                priceOver100={priceOver100}
                handleFilterCapacity={handleFilterCapacity}
                clearCapacityFilter={clearCapacityFilter}
                handleFilterPriceMinField={handleFilterPriceMinField}
                handleFilterPriceMaxField={handleFilterPriceMaxField}
                fetchClasses={fetchClasses}
                handleVegetarian={handleVegetarian}
                handleVegan={handleVegan}
                handleNutAllergy={handleNutAllergy}
              ></FilterSideBar>
            </Col>
            <Col xs={12} lg={12} xl={7}>
              <Container fluid>
                <Row>{classCards}</Row>
                <Row>
                  <Col xs={12} className="text-center mt-2">
                    <div className="btn-group" role="group">
                      <Button onClick={previousPage} disabled={skip === 0 ? true : false}>
                        Previous
                      </Button>
                      <Button
                        onClick={nextPage}
                        disabled={skip + filteredClasses.length >= numberOfEntries ? true : false}
                      >
                        Next
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col xs={12} lg={12} xl={4}>
              {filteredClasses.length > 0 ? (
                <ClassesMap classes={filteredClasses}></ClassesMap>
              ) : null}
            </Col>
          </Row>
        </Layout>
      </div>
    </>
  );
};
