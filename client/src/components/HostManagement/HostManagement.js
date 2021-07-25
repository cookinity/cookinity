import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMoneyBill } from '@fortawesome/free-solid-svg-icons';
import Layout from '../Layout/Layout';
import { Alert, Button, Col, Row } from 'react-bootstrap';

import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { ClassesTable } from './ClassesTable';
import { LinkContainer } from 'react-router-bootstrap';
import './HostManagementStyles.scss';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const HostManagement = () => {
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [pastClasses, setPastClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [stripeAccountCreated, setStripeAccountCreated] = useState(false);
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    // Check to see if this is a redirect back from stripe account onboarding
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setStripeAccountCreated(true);
      history.push({
        pathname: '/host-management',
        search: '',
      });
    }
  }, []);

  const fetchClasses = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      // load all classes for which the currently logged in user is host
      const result = await axios.get('/api/classes', { params: { hostId: auth.me.id } });
      const unformattedClasses = result.data.classes;
      const today = dayjs(new Date());
      const classesWithAFutureDate = [];
      const classesWihoutAFutureDate = [];
      unformattedClasses.forEach((c) => {
        const cCopy = { ...c };
        cCopy.pastDates = [];
        cCopy.futureDates = [];

        for (const ts of cCopy.timeSlots) {
          const date = dayjs(ts.date);
          if (date.isBefore(today)) {
            cCopy.pastDates.push(date.format('llll'));
          } else {
            cCopy.futureDates.push(date.format('llll'));
          }
        }
        if (cCopy.futureDates.length !== 0) {
          classesWithAFutureDate.push(cCopy);
        } else {
          classesWihoutAFutureDate.push(cCopy);
        }
      });

      setUpcomingClasses(classesWithAFutureDate);
      setPastClasses(classesWihoutAFutureDate);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  const deleteClass = async (c) => {
    setIsLoading(true);
    setIsError(false);
    try {
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

      await axios.delete(`/api/classes/${c.id}`, config);
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const onDeleteCallback = (c) => {
    return async () => {
      await deleteClass(c);
      await fetchClasses();
    };
  };

  const toStripeDashboard = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
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
      const response = await axios.post('/api/payment/generate-dashboard-link', null, config);
      // open in new window
      window.open(response.data.url, '_blank');
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const createAccount = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setIsError(false);
    try {
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
      const response = await axios.post('/api/payment/onboard-user', null, config);
      window.location = response.data.url;
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const content =
    auth && auth.me && auth.me.hasStripeAccount ? (
      <>
        <LinkContainer to={`/hostmanagement/create-class`}>
          <Button variant="success" className="mt-2 mr-2">
            <FontAwesomeIcon icon={faPlus} /> Create a new class
          </Button>
        </LinkContainer>
        <Button variant="secondary" className="mr-2 mt-2 paymentButton" onClick={toStripeDashboard}>
          <FontAwesomeIcon icon={faMoneyBill} /> Payments
        </Button>
        <LinkContainer to={`/hostmanagement/booked-classes`}>
          <Button variant="info" className="mt-2">
            <FontAwesomeIcon icon="info-circle" /> Booked classes
          </Button>
        </LinkContainer>
        <div className="tableBackground mt-6">
          <h1 className="text-center">Upcoming Classes</h1>
          <ClassesTable
            classes={upcomingClasses}
            onDeleteCallback={onDeleteCallback}
          ></ClassesTable>
          <hr></hr>
        </div>
        <div className="tableBackground">
          <h1 className="text-center">Past Classes</h1>
          <ClassesTable classes={pastClasses} onDeleteCallback={onDeleteCallback}></ClassesTable>
        </div>
      </>
    ) : (
      <>
        <p>
          You need to setup a stripe account to be able to host cooking classes and collect
          payments!
        </p>
        <a className="stripe-connect" onClick={createAccount}>
          <span>Connect with</span>
        </a>
      </>
    );

  if (isLoading) {
    return (
      <LayoutNarrow>
        <Loader></Loader>
      </LayoutNarrow>
    );
  } else if (stripeAccountCreated) {
    return (
      <LayoutNarrow>
        <Row>
          <Col>
            {' '}
            <Alert variant="success">Stripe Account Created! Please reload this page</Alert>
          </Col>
        </Row>
      </LayoutNarrow>
    );
  } else
    return (
      <div className="bgHostManagement">
        <LayoutNarrow>
          <Row>
            <Col>
              <div>
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
                {content}
              </div>
            </Col>
          </Row>
        </LayoutNarrow>
      </div>
    );
};

export default compose(requireAuth)(HostManagement);
