import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, CardColumns, CardDeck, Col, Row } from 'react-bootstrap';

import ClassCard from './ClassCard';
import Filters from './Filters';
import Loader from 'components/Shared/Loader/Loader';

export const Home = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchClasses = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios('/api/classes');
        setClasses(result.data.classes);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };

    fetchClasses();
  }, []);

  //Darstellung aller Kurse ohne Filter
  const classCards = classes.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <ClassCard c={c} key={c.id}></ClassCard>
      </Col>)
  });

  //mit Filter In CardsOverview oder hier (implementierung wenn filter geht)
  const classCardsfilter = classes.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <ClassCard c={c} key={c.id}></ClassCard>
      </Col>)
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
          <Row><Col>
            <Filters />
          </Col>
          </Row>
          <p></p>
          <Row>{classCards} </Row>
        </div>
      </Layout>
    );
  }
};
