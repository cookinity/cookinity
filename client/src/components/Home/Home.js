import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Filters from './Filters';
import Loader from 'components/Shared/Loader/Loader';
import { CLASS_CATEGORIES } from 'constants/ClassCategories';
import { CITY_CATEGORIES } from 'constants/CityCategories';

export const Home = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchClasses(undefined); // no filter set --> pull in all classes
  }, []);

  const fetchClasses = async (filters) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await axios('/api/classes');
      setClasses(result.data.classes);
      setFilteredClasses(result.data.classes);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  const handleFilterCategory = (e) => {
    let value = e.target.value;
    let result = [];
    result = classes.filter((data) => {
      return data.category.search(value) != -1;
    });
    setFilteredClasses(result);
  };

  const handleFilterCity = (e) => {
    let value = e.target.value;
    let result = [];
    result = classes.filter((data) => {
      return data.meetingAddress.city.search(value) != -1;
    });
    setFilteredClasses(result);
  };

  //Darstellung aller Kurse ohne Filter
  const classCards = filteredClasses.map((c) => {
    return (
      <Col key={c.id} sm={12} md={6} lg={4}>
        <ClassCard c={c} ></ClassCard>
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
      <Layout>
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
          <Row>
            <Col>
              <Filters
                options={CLASS_CATEGORIES}
                prompt="Select category"
                fun={(event) => handleFilterCategory(event)}
              />
              <Filters
                options={CITY_CATEGORIES}
                prompt="Select city"
                fun={(event) => handleFilterCity(event)}
              />
            </Col>
          </Row>
          <p></p>
          <Row> {classCards} </Row>
        </div>
      </Layout>
    );
  }
};
