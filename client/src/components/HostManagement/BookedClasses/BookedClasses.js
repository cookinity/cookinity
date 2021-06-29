import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from 'components/Layout/Layout'
import { compose } from 'redux';
import requireAuth from 'higherOrderComponents/requireAuth';
import Loader from 'components/Shared/Loader/Loader';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { Alert, Col, Row } from 'react-bootstrap';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { BookedClassesTable } from './BookedClassesTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';


const BookedClasses = () => {
    const [booked, setBooked] = useState([]);
    const [notBooked, setNotBooked] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const auth = useSelector((state) => state.auth);
    
    useEffect(() => {
        fetchClasses();
      }, []);

    const fetchClasses = async () => {
        setIsError(false);
        setIsLoading(true);
        try {
          // load all classes for which the currently logged in user is host
          const result = await axios.get('/api/classes', { params: { hostId: auth.me.id } });
          const unformattedClasses = result.data.classes;
          const classesBooked = [];
          const classesNotBooked = [];
          unformattedClasses.forEach((c) => {
            const cCopy = { ...c };
            cCopy.booked = [];
            cCopy.notBooked = [];

            //const bookedClasses = cCopy.filter(class => class.timeSlots.)
            for (const ts of cCopy.timeSlots) {
                const isBooked = ts.isBooked
                const date = dayjs(ts.date);
                
                if (isBooked) {
                    cCopy.booked.push(date.format('llll'));
                } else {
                    cCopy.notBooked.push(date.format('llll'));
                }
            }

            if (cCopy.booked.length !== 0) {
              classesBooked.push(cCopy);
            } else {
              classesNotBooked.push(cCopy);
            }
          });
    
          setBooked(classesBooked);
          setNotBooked(classesNotBooked);
        } catch (err) {
          setIsError(true);
          setErrorMessage(err?.response?.data.message || err.message);
        }
        setIsLoading(false);
      };


    const onDeleteCallback = (c) => {
    return async () => {
        await fetchClasses();
    };
    };

    if (isLoading) {
        return (
          <Layout>
            <Loader></Loader>
          </Layout>
        );
    } else {
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
                    <h1 className="text-center">Booked Classes</h1>
                    <BookedClassesTable
                        classes={booked}
                        onDeleteCallback={onDeleteCallback}
                    ></BookedClassesTable>
                    <hr></hr>
                    <h1 className="text-center">Not yet booked Classes</h1>
                    <BookedClassesTable
                        classes={notBooked}
                        onDeleteCallback={onDeleteCallback}
                    ></BookedClassesTable>
                    </div>
                </Col>
            </Row>
        </Layout>
        );
    }   
}

export default compose(requireAuth)(BookedClasses);