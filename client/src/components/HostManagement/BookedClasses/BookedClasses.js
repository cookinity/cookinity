import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from 'components/Layout/Layout';
import { compose } from 'redux';
import requireAuth from 'higherOrderComponents/requireAuth';
import Loader from 'components/Shared/Loader/Loader';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Alert, Col, Row } from 'react-bootstrap';
import { BookedClassesTable } from './BookedClassesTable';
import LayoutNarrow from 'components/Layout/LayoutNarrow';

const BookedClasses = () => {
  const [futureBookings, setFutureBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // @ts-ignore
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsError(false);
    setIsLoading(true);
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
      // load all bookings for which the currently logged in user is host
      const result = await axios.get('/api/bookings', config);
      const unformattedBookings = result.data.bookings;
      const classesBookedFuture = [];
      const classesBookedPast = [];
      const today = dayjs(new Date());
      unformattedBookings.forEach((b) => {
        const date = dayjs(b.bookedTimeSlot.date);
        if (date.isBefore(today)) {
          classesBookedPast.push(b);
        } else {
          classesBookedFuture.push(b);
        }
      });

      setFutureBookings(classesBookedFuture);
      setPastBookings(classesBookedPast);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    // @ts-ignore
    return (
      <LayoutNarrow>
        <Loader></Loader>
      </LayoutNarrow>
    );
  } else {
    return (
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
              <h1 className="text-center">Future Bookings</h1>
              <BookedClassesTable bookings={futureBookings}></BookedClassesTable>
              <hr></hr>
              <h1 className="text-center">Past Bookings</h1>
              <BookedClassesTable bookings={pastBookings}></BookedClassesTable>
            </div>
          </Col>
        </Row>
      </LayoutNarrow>
    );
  }
};

export default compose(requireAuth)(BookedClasses);
