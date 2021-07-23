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
import Footer from '../Layout/Footer';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
dayjs.extend(utc);

export const Home = () => {
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // @ts-ignore
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);

  const [startDate, setStartDate] = useState(undefined);
  const [cat, setCat] = useState(undefined);
  const [city, setCity] = useState(undefined);
  const [guests, setGuests] = useState('');
  const [priceLow, setPriceLow] = useState('');
  const [priceUp, setPriceUp] = useState('');
  const [rating, setRating] = useState('');
  const [vegan, setVegan] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [nutAllergy, setNutAllergy] = useState(false);
  const [pescatarian, setPescatarian] = useState(false);
  const [eggFree, setEggFree] = useState(false);
  const [soyFree, setSoyFree] = useState(false);

  const location = useLocation();
  const history = useHistory();

  // @ts-ignore
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    if (location.state) {
      // @ts-ignore
      const { cityFilter, categoryFilter, dateFilter } = location.state;
      setCity(cityFilter);
      setCat(categoryFilter);
      setStartDate(dateFilter);
      history.replace('/home', null);
      // call with filters from location
      fetchClasses(categoryFilter, dateFilter, cityFilter)();
    } else {
      // call with state
      fetchClasses(cat, startDate, city)();
    }
  }, [
    skip,
    limit,
    priceLow,
    priceUp,
    guests,
    rating,
    vegan,
    vegetarian,
    nutAllergy,
    pescatarian,
    eggFree,
    soyFree,
  ]);

  const fetchClasses = (categoryFilter, dateFilter, cityFilter) => async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      let date = undefined;
      if (dateFilter) {
        date = dayjs.utc(dateFilter.toDate()).format();
      }
      const queryObject = {
        skip,
        limit,
        city: cityFilter,
        category: categoryFilter,
        date: date,
        guests,
        priceLow,
        priceUp,
        rating,
        vegan,
        vegetarian,
        nutAllergy,
        pescatarian,
        eggFree,
        soyFree,
      };

      let result;
      if (auth.isAuthenticated) {
        // adding the necessary security header
        const token = auth.token;
        const config = {
          headers: {
            'Content-type': 'application/json',
          },
        };
        if (token) {
          config.headers['x-auth-token'] = token;
        }
        result = await axios.post(`/api/classes/query`, queryObject, config);
      } else {
        result = await axios.post(`/api/classes/query`, queryObject);
      }

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

  const handleFilterDate = (date) => {
    setStartDate(date);
  };

  const handleFilterCapacity = (numberOfGuest) => {
    setGuests(numberOfGuest);
  };

  const handleFilterPrice = (priceRange) => {
    setPriceLow(priceRange[0]);
    setPriceUp(priceRange[1]);
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

  const handlePescatarian = (e) => {
    if (e.target.checked) setPescatarian(true);
    else setPescatarian(false);
  };

  const handleEggFree = (e) => {
    if (e.target.checked) setEggFree(true);
    else setEggFree(false);
  };

  const handleSoyFree = (e) => {
    if (e.target.checked) setSoyFree(true);
    else setSoyFree(false);
  };

  const handleFilterRating = (minimumStars) => {
    setRating(minimumStars);
  };

  const classCards = filteredClasses.map((c) => {
    return (
      <Col className="mb-1" sm={12} xl={6} key={c.id}>
        <ClassCard c={c} filterDate={startDate} key={c.id}></ClassCard>
      </Col>
    );
  });

  return (
    <>
      <div>
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
          <Row className="mb-4">
            <Col>
              <FilterBar
                category={cat}
                city={city}
                handleFilterCity={handleFilterCity}
                handleFilterCategory={handleFilterCategory}
                handleFilterDate={handleFilterDate}
                startDate={startDate}
                onSearchHandler={fetchClasses(cat, startDate, city)}
              ></FilterBar>
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={12} xl={2} className="mb-4">
              <FilterSideBar
                handleFilterRating={handleFilterRating}
                handleFilterPrice={handleFilterPrice}
                handleFilterCapacity={handleFilterCapacity}
                handleVegetarian={handleVegetarian}
                handleVegan={handleVegan}
                handleNutAllergy={handleNutAllergy}
                handlePescatarian={handlePescatarian}
                handleEggFree={handleEggFree}
                handleSoyFree={handleSoyFree}
              ></FilterSideBar>
            </Col>
            <Col xs={12} lg={12} xl={6}>
              <div style={{ display: isLoading ? 'block' : 'none' }}>
                <Loader></Loader>
              </div>
              <Container fluid style={{ display: isLoading ? 'none' : 'block' }}>
                <Row xs={1} md={2} lg={2}>
                  {filteredClasses.length === 0 ? (
                    <div className="alert alert-warning mx-auto text-center" role="alert">
                      <span>🥺 We are sorry! We found no classes for your selected filters! 🥺</span>
                      <br />
                      <span>💡 Try a different combination of filters 💡</span>
                      <br />
                      <span>🍽️ Maybe even try hosting your own cooking class 🍽️ </span>
                    </div>
                  ) : null}

                  {classCards}
                </Row>
                <Row>
                  <Col xs={12} className="text-center mt-2 mb-4">
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
              <div style={{ display: filteredClasses.length > 0 ? 'block' : 'none' }}>
                <ClassesMap classes={filteredClasses}></ClassesMap>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
      <Footer></Footer>
    </>
  );
};
