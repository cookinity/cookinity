import React, { useEffect, useState } from 'react';
import { Alert, Carousel, Container, Row, Col, Image, Button, ProgressBar } from 'react-bootstrap';
import './classDetail.scss';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Loader from 'components/Shared/Loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';
import ClassDetailMap from './ClassDetailMap';
import LayoutNarrow from 'components/Layout/LayoutNarrow';
import { useSelector } from 'react-redux';
const Spacer = require('react-spacer');
const { render } = require('react-dom');

function formatAddress(address) {
  return address.street + ', ' + address.zip + ' ' + address.city;
}

function dateWithDuration(date, duration) {
  return date.add(duration, 'minute');
}

const ColoredLine = ({ color }) => (
  <hr
    style={{
      color: color,
      backgroundColor: color,
      height: 0.1,
    }}
  />
);

const ClassDetail = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [futureDates, setFutureDates] = useState([]);
  const [numFeedback, setNumFeedback] = useState(0);

  const history = useHistory();
  const auth = useSelector((state) => state.auth);
  const isLoggedIn = auth && auth.isAuthenticated;

  const prevIcon = <i className="fa fa-arrow-left" />;
  const nextIcon = <i className="fa fa-arrow-right" />;

  const carouselImages = photos.map((src) => (
    <Carousel.Item interval={3000} key={src}>
      <div className="photoFrame">
        <img className="carouselImageSetting" src={src} alt="Cooking Class Inspiration" />
      </div>
    </Carousel.Item>
  ));

  // id of the class in the route
  let { classId } = useParams();

  useEffect(() => {
    const fetchClass = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const result = await axios(`/api/classes/${classId}`);
        result.data.class.feedbacks.sort((a, b) => {
          const aDate = dayjs(a.feedbackDate);
          const bDate = dayjs(b.feedbackDate);
          if (aDate.isBefore(bDate)) {
            return 1;
          } else if (aDate.isAfter(bDate)) {
            return -1;
          } else {
            return 0;
          }
        });
        setNumFeedback(result.data.class.feedbacks.length);
        result.data.class.feedbacks = result.data.class.feedbacks.slice(0, 10);
        setClass(result.data.class);
        //set available photos
        const p = [];
        if (result.data.class.coverPhoto) {
          p.push(result.data.class.coverPhoto);
        }
        if (result.data.class.photoOne) {
          p.push(result.data.class.photoOne);
        }
        if (result.data.class.photoTwo) {
          p.push(result.data.class.photoTwo);
        }
        setPhotos(p);
        //set future dates
        const d = [];
        const today = dayjs(new Date());
        for (const timeslot of result.data.class.timeSlots) {
          if (dayjs(timeslot.date).isAfter(today) && !timeslot.isBooked) {
            d.push(dayjs(timeslot.date));
          }
        }
        // sort future dates earlierst to latest
        d.sort((a, b) => {
          if (a.isBefore(b)) {
            return -1;
          } else if (a.isAfter(b)) {
            return 1;
          } else {
            return 0;
          }
        });

        setFutureDates(d);
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
  }
  if (c) {
    const ratings = [
      {
        name: 'Overall Rating',
        rating: c.avgRating,
      },
      {
        name: 'Host Rating',
        rating: c.hostRating,
      },
      {
        name: 'Taste Rating',
        rating: c.tasteRating,
      },
      {
        name: 'Location Rating',
        rating: c.locationRating,
      },
      {
        name: 'Price-Quality Rating',
        rating: c.vtmrRating,
      },
      {
        name: 'Experience Rating',
        rating: c.expRating,
      },
    ];
    return (
      <LayoutNarrow>
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
          <Container fluid>
            <Carousel
              className="carousel slide photoAttribute"
              data-ride="carousel"
              nextIcon={nextIcon}
              prevIcon={prevIcon}
            >
              {carouselImages}
            </Carousel>
            <h1 className="classTitle">{c.title}</h1>
            <Row>
              <Col className="classDetail">
                <FontAwesomeIcon icon="euro-sign" size="2x" className="iconPos fa-fw" />
                {c.pricePerPerson} ??? per person
              </Col>
              <Col className="classDetail">
                <FontAwesomeIcon icon="users" size="2x" className="iconPos fa-fw" />
                {c.minGuests} - {c.maxGuests} persons
              </Col>
              <Col className="classDetail">
                <FontAwesomeIcon icon="clock" size="2x" className="iconPos fa-fw" />
                {c.durationInMinutes} Minutes
              </Col>
            </Row>
            <ColoredLine color="gray" />
            <div className="mr-4 ml-4">
              <ClassDetailMap c={c}></ClassDetailMap>
            </div>
            <ColoredLine color="gray" />
            <h3>
              Upcoming Dates{' '}
              <FontAwesomeIcon icon="calendar-alt" size="1x" className="iconPos fa-fw" />
            </h3>
            <ul>
              {futureDates.map((date) => (
                <li key={date}>
                  {date.format('dddd, DD MMM, h:mm A')} -{' '}
                  {dateWithDuration(date, c.durationInMinutes).format('h:mm A')}
                </li>
              ))}
            </ul>
            <ColoredLine color="gray" />
            <h3>
              Description <FontAwesomeIcon icon="info-circle" size="1x" className="iconPos fa-fw" />
            </h3>
            <Row className="rowFormat">{c.description}</Row>
            <ColoredLine color="gray" />
            <h3>
              What to bring <FontAwesomeIcon icon="utensils" size="1x" className="iconPos fa-fw" />
            </h3>
            <Row className="rowFormat">{c.toBring}</Row>
            <ColoredLine color="gray" />

            {/* Dietary preferences */}
            <h3>Dietary preferences</h3>
            <Container>
              <Row className="dietaryRows">
                <Col>
                  <FontAwesomeIcon
                    icon="carrot"
                    size="2x"
                    className="iconPos fa-fw"
                    color="#ff9900"
                  />
                  {c.vegetarianFriendly ? 'vegetarian ???' : 'vegetarian ???'}{' '}
                </Col>
                <Col>
                  {' '}
                  <FontAwesomeIcon
                    icon="seedling"
                    size="2x"
                    className="iconPos fa-fw"
                    color="#339933"
                  />
                  {c.veganFriendly ? 'vegan ??? ' : 'vegan ???'}{' '}
                </Col>
                <Col>
                  {' '}
                  <FontAwesomeIcon
                    icon="cookie"
                    size="2x"
                    className="iconPos fa-fw"
                    color="#dea95d"
                  />
                  {c.nutAllergyFriendly ? 'nut free  ???' : 'nut free ???'}{' '}
                </Col>
              </Row>
              <Row className="dietaryRows">
                <Col>
                  <FontAwesomeIcon
                    icon="fish"
                    size="2x"
                    className="iconPos fa-fw"
                    color="#99ccff"
                  />
                  {c.pescatarianFriendly ? 'pescatarian ???' : 'pescatarian ???'}{' '}
                </Col>
                <Col>
                  {' '}
                  <FontAwesomeIcon icon="egg" size="2x" className="iconPos fa-fw" color="#ffdab3" />
                  {c.eggFree ? 'egg-free ??? ' : 'egg-free ???'}{' '}
                </Col>
                <Col>
                  {' '}
                  <FontAwesomeIcon
                    icon="leaf"
                    size="2x"
                    className="iconPos fa-fw"
                    color="#267326"
                  />
                  {c.soyFree ? 'soy-free  ???' : 'soy-free ???'}{' '}
                </Col>
              </Row>
            </Container>
            <ColoredLine color="gray" />

            {/* Class Feedback */}
            <h3>
              Feedback <FontAwesomeIcon icon="star" size="1x" className="iconPos fa-fw" />
            </h3>
            <h6>
              Average: {c.avgRating?.toFixed(2)} ({numFeedback} Ratings)
            </h6>
            <div className="ratingContainer">
              <Row xs={1} md={2}>
                {ratings.map((rating, index) => [
                  <Col xs={12} md={6} className="progressBars" key={index}>
                    <div className="ratingRow">
                      {rating.name}
                      <div className="ratingInnerRow">
                        <div className="ratingBar">
                          <ProgressBar now={(rating.rating / 5) * 100} />
                        </div>
                        <div className="ratingFontSize">{rating.rating?.toFixed(2)}</div>
                      </div>
                    </div>
                  </Col>,
                  // index % 2 === 0 && <Col xs={0} md={4}></Col>,
                ])}
              </Row>
            </div>

            {/* Feedback Comments */}
            <div>
              <Row xs={1} md={2}>
                {c.feedbacks.map((f) => (
                  <Col key={f.id}>
                    <div className="feedbackContainer">
                      <div className="feedbackProfile">
                        <Image src={f.reviewer.avatar} className="reviewerImage" roundedCircle />
                        <div>
                          {f.reviewer.name}
                          <div>{dayjs(f.feedbackDate).format('MMMM YYYY')}</div>
                        </div>
                      </div>
                      <Row>
                        <Col>
                          <div className="feedbackDescription">
                            <p>{f.overallRating}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
            <ColoredLine color="gray" />
            {/* Host Information */}
            <Container>
              <Row>
                <Col xs={12} md={3}>
                  <div className="text-center">
                    <Image src={c.host.avatar} className="hostImage" roundedCircle />
                  </div>
                </Col>
                <Col xs={12} md={9}>
                  <h3>Get to know your host: {c.host.name}</h3>
                  <p className="breakWords">{c.host.description}</p>
                </Col>
              </Row>
            </Container>
            <div className="text-center">
              {isLoggedIn ? (
                <LinkContainer to={`/classes/${c.id}/booking`}>
                  <Button variant="primary">Book Now</Button>
                </LinkContainer>
              ) : (
                <LinkContainer to={`/login`}>
                  <Button variant="primary">Login To Book A Class</Button>
                </LinkContainer>
              )}
            </div>
          </Container>
        </div>
      </LayoutNarrow>
    );
  } else {
    return <div>Class not found!</div>;
  }
};

export default ClassDetail;
