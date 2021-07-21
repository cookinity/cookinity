import axios from 'axios';
import Layout from 'components/Layout/Layout';
import Loader from 'components/Shared/Loader/Loader';
import React, { useEffect, useState } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';
import BookingForm from './BookingForm';
import { loadStripe } from '@stripe/stripe-js';
import { PUBLIC_STRIPE_KEY } from 'constants/StripeKey';
import LayoutNarrow from 'components/Layout/LayoutNarrow';

const stripePromise = loadStripe(PUBLIC_STRIPE_KEY);

const BookClass = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  // id of the class in the route
  let { classId } = useParams();

  const submitCallback = (timeSlot, numberOfGuests) => {
    return async () => {
      const stripe = await stripePromise;

      // adding the necessary security header
      const token = auth.token;
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
        params: {
          classId: c.id,
          timeSlotId: timeSlot.id,
          numberOfGuests: numberOfGuests,
        },
      };
      if (token) {
        config.headers['x-auth-token'] = token;
      }

      const response = await axios.post('/api/payment/create-checkout-session', null, config);
      const session = response.data.session;

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        setErrorMessage(result.error.message);
      }
    };
  };

  useEffect(() => {
    const fetchClass = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`/api/classes/${classId}`);
        setClass(result.data.class);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };
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
                  <BookingForm c={c} submitCallback={submitCallback}></BookingForm>
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

export default compose(requireAuth)(BookClass);
