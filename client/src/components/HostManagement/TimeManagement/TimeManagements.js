import Layout from 'components/Layout/Layout';
import React, { useState } from 'react';
import { compose } from 'redux';
import requireAuth from '../../../higherOrderComponents/requireAuth';

import axios from 'axios';
import { useSelector } from 'react-redux';
import ClassForm from 'components/ClassForm/ClassForm';
import { Alert, Button, Col, Row } from 'react-bootstrap';
import Loader from 'components/Shared/Loader/Loader';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker, { Calendar, DateObject } from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TimeSlotTable } from './TimeSlotTable';
import './TimeSlotStyles.scss';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
dayjs.extend(utc);

const TimeManagement = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newDate, setNewDate] = useState(new DateObject().add(1, 'day'));
  const auth = useSelector((state) => state.auth);
  // id of the class in the route
  let { classId } = useParams();

  const deleteTimeSlot = async (ts) => {
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

      await axios.delete(`/api/classes/${c.id}/timeslots/${ts.id}`, config);
      setIsLoading(false);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const onDeleteCallback = (ts) => {
    return async () => {
      await deleteTimeSlot(ts);
      await fetchClass();
    };
  };

  const onNewDate = async () => {
    setIsLoading(true);
    setIsError(false);
    if (!(newDate instanceof DateObject) || !c) {
      return;
    }
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

      const timeSlot = {
        date: dayjs(newDate.toDate()).utc().toJSON(),
      };

      await axios.post(`/api/classes/${c.id}/timeslots`, timeSlot, config);
      setIsLoading(false);
      setNewDate(new DateObject().add(1, 'day'));
      fetchClass();
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
      setIsLoading(false);
    }
  };

  const fetchClass = async () => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await axios(`/api/classes/${classId}`);
      if (result.data.class.timeSlots) {
        result.data.class.timeSlots.sort((a, b) => {
          const aDate = dayjs(a.date);
          const bDate = dayjs(b.date);
          if (aDate.isBefore(bDate)) {
            return +1;
          } else if (aDate.isAfter(bDate)) {
            return -1;
          } else {
            return 0;
          }
        });
      }
      setClass(result.data.class);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClass();
  }, []);

  if (isLoading) {
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
              <div>
                {c ? (
                  <>
                    <Row>
                      <Col>
                        <h1 className="text-center">Manage Bookable Times of {c.title}</h1>
                      </Col>
                    </Row>
                    <Row className="mb-2">
                      <Col xs={12} className="text-center">
                        <DatePicker
                          minDate={new DateObject().add(1, 'day')}
                          format="MM/DD/YYYY HH:mm"
                          value={newDate}
                          onChange={setNewDate}
                          plugins={[<TimePicker hideSeconds position="right" />]}
                        ></DatePicker>
                      </Col>
                      <Col xs={12} className="text-center mt-1">
                        <Button onClick={onNewDate}>Add New Date</Button>
                      </Col>
                    </Row>
                    <Row>
                      <TimeSlotTable c={c} onDeleteCallback={onDeleteCallback}></TimeSlotTable>
                    </Row>
                  </>
                ) : (
                  <div>No class found!</div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </LayoutNarrow>
    );
  }
};

export default compose(requireAuth)(TimeManagement);
