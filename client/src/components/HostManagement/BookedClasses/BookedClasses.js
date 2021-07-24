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
import './BookedClasses.scss';

const BookedClasses = () => {
  const [moneyEarned, setMoneyEarned] = useState(0);
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
      const result = await axios.get('/api/bookings/ashost', config);
      const unformattedBookings = result.data.bookings;

      // sum up orders.totalPrice
      let totalMoneyEarned = unformattedBookings.reduce((acc, curr) => {
        return acc + curr.totalPrice * 0.9;
      }, 0);
      totalMoneyEarned = (totalMoneyEarned / 100).toFixed(2);
      setMoneyEarned(totalMoneyEarned);

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

  let content;

  if (futureBookings.length > 0 || pastBookings.length > 0) {
    content = (
      <div>
        <h1 className="display-4 mb-6 text-center primaryTextCol">
          💶 Congratulation! You already earned {moneyEarned} € with Cookinity!💶
        </h1>
        <h1 className="text-center">Upcoming Bookings</h1>
        <BookedClassesTable bookings={futureBookings} isPastTable={false}></BookedClassesTable>
        <hr></hr>
        <h1 className="text-center">Past Bookings</h1>
        <BookedClassesTable bookings={pastBookings} isPastTable={true}></BookedClassesTable>
      </div>
    );
  } else {
    content = <Alert variant="warning">😢 Nobody has booked a class from you yet😢</Alert>;
  }

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
      </LayoutNarrow>
    );
  }
};

export default compose(requireAuth)(BookedClasses);
