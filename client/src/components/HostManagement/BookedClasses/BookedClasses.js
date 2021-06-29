import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from 'components/Layout/Layout'
import { compose } from 'redux';
import requireAuth from 'higherOrderComponents/requireAuth';
import Loader from 'components/Shared/Loader/Loader';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Alert, Col, Row } from 'react-bootstrap';
import { BookedClassesTable } from './BookedClassesTable';


const BookedClasses = () => {
    const [futureBookings, setFutureBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const auth = useSelector((state) => state.auth);
    
    useEffect(() => {
        fetchBookings();
      }, []);

    const fetchBookings = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          // load all bookings for which the currently logged in user is host
          const result = await axios.get('/api/bookings', { params: { hostId: auth.me.id } });
          const unformattedBookings = result.data.bookings;
          const classesBookedFuture = [];
          const classesBookedPast = [];
          const today = dayjs(new Date());
          unformattedBookings.forEach((b) => {
            const date = dayjs(b.bookedTimeSlot);
            if (date.isBefore(today)) {
                classesBookedPast.push(b)
            } else {
                classesBookedFuture.push(b)
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
        return (
          <Layout>
            <Loader></Loader>
          </Layout>
        );
    } else {
        console.log('futurebookings',futureBookings)
        console.log('pastBookings',pastBookings)
    return (
        <Layout>
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
                    <BookedClassesTable
                        bookings={futureBookings}
                    ></BookedClassesTable>
                    <hr></hr>
                    <h1 className="text-center">Past Bookings</h1>
                    <BookedClassesTable
                        bookings={pastBookings}
                    ></BookedClassesTable>
                    </div>
                </Col>
            </Row>
        </Layout>
        );
    }   
}

export default compose(requireAuth)(BookedClasses);