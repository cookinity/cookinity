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
      <Col className="mb-1" sm={12} xl={6} key={c.id}>
        <ClassCard c={c} filterDate={startDate} key={c.id}></ClassCard>
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
            <Col xs={12} lg={12} xl={2}>
              <FilterSideBar></FilterSideBar>
            </Col>
            <Col xs={12} lg={12} xl={6}>
              <Container fluid>
                <Row xs={1} md={2} lg={2}>{classCards}</Row>
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
              <div style={{ display: filteredClasses.length > 0 ? 'block' : 'none' }}>
                <ClassesMap classes={filteredClasses}></ClassesMap>
              </div>
            </Col>
          </Row>
        </Layout>
      </div>
    </>
  );
};
