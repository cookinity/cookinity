import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row, Button, Container } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Loader from 'components/Shared/Loader/Loader';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import FilterBar from './FilterBar';
import FilterSideBar from './FilterSideBar';
dayjs.extend(utc);
export const Home = () => {
  const [numberOfEntries, setNumberOfEntries] = useState(0);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [limit, setLimit] = useState(2);
  const [skip, setSkip] = useState(0);

  const [startDate, setStartDate] = useState(undefined);
  const [cat, setCat] = useState(undefined);
  const [city, setCity] = useState(undefined);
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

  const handleFilterPrice = (e) => {
    setPrice(e);
  };

  const handleFilterRating = (e) => {
    setRating(e);
  };

  const openNav = () => {
    document.getElementById('sidebar').style.width = '20%';
    document.getElementById('main').style.width = '65%';
  };

  const closeNav = () => {
    document.getElementById('sidebar').style.width = '0';
    document.getElementById('main').style.width = '100%';
  };

  const classCards = filteredClasses.map((c) => {
    return (
      <Col className="mb-1" sm={12} md={6} lg={4}>
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
            <Col xs={12} md={3}>
              <FilterSideBar></FilterSideBar>
            </Col>
            <Col xs={12} md={9}>
              <Container fluid>
                <Row>{classCards}</Row>
              </Container>
            </Col>
          </Row>
          <Row>
            <Col xs={12} className="text-center mt-2">
              <div className="btn-group" role="group">
                <Button onClick={previousPage} disabled={skip === 0 ? true : false}>
                  Previous
                </Button>
                <Button onClick={nextPage} disabled={skip >= numberOfEntries - 1 ? true : false}>
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
    </>
  );
};
