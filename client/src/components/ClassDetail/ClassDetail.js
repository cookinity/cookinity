import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { Alert, Carousel, Container, Row, Col, Image, Button } from 'react-bootstrap';
import './classDetail.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import Loader from 'components/Shared/Loader/Loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { LinkContainer } from 'react-router-bootstrap';


//ToDo: Bookable Dates Anzeigen mit Duration addiert (nur future dates)
//ToDo: Add section mit essens zeug preferenzen (vegan stuff und so)

function formatAddress(address) {
  return address.street + ', ' + address.zip + ' ' + address.city;
}

function dateWithDuration(date, duration) {
  return date.add(duration, 'minute')
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
        const d = []
        const today = dayjs(new Date());
        for (const timeslot of result.data.class.timeSlots) {
          if (dayjs(timeslot.date).isAfter(today)) {
            d.push(dayjs(timeslot.date));
          }
        }
        setFutureDates(d)
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
      <Layout>
        <Loader></Loader>
      </Layout>
    );
  }
  if (c) {
    console.log(c)
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
        <Carousel>{carouselImages}</Carousel>
        <h1 className="classTitle">{c.title}</h1>
        <Container>
          <Row>
            <Col className="classDetail">
              <FontAwesomeIcon icon="euro-sign" size="2x" className="iconPos fa-fw" />
              {c.pricePerPerson} € per person
            </Col>
            <Col className="classDetail">
              <FontAwesomeIcon icon="users" size="2x" className="iconPos fa-fw" />{c.minGuests} -{' '}
              {c.maxGuests} persons
            </Col>
            <Col className="classDetail">
              <FontAwesomeIcon icon="map-marker-alt" size="2x" className="iconPos fa-fw" />
              {formatAddress(c.meetingAddress)}
            </Col>
          </Row>
        </Container>
        <ColoredLine color="gray" />
        <h3>Upcoming Dates <FontAwesomeIcon icon="calendar-alt" size="1x" className="iconPos fa-fw" /></h3>
        <ul>
          {futureDates.map((date) => (
            <li key={date}>{date.format('dddd, DD MMM, h:mm A')} - {dateWithDuration(date, c.durationInMinutes).format('h:mm A')}</li>
          ))}
        </ul>
        <ColoredLine color="gray" />
        <h3>Description <FontAwesomeIcon icon="info-circle" size="1x" className="iconPos fa-fw" /></h3>
        <Row className="rowFormat">{c.description}</Row>
        <ColoredLine color="gray" />
        <h3>What to bring <FontAwesomeIcon icon="utensils" size="1x" className="iconPos fa-fw" /></h3>
        <Row className="rowFormat">{c.toBring}</Row>
        <ColoredLine color="gray" />
        <h3>Dietary preferences</h3>
        <Container>
          <Row>
            <Col><FontAwesomeIcon icon="carrot" size="2x" className="iconPos fa-fw" />{c.vegetarianFriendly ? 'vegetarian ✔' : 'vegetarian ❌'} </Col>
            <Col> <FontAwesomeIcon icon="seedling" size="2x" className="iconPos fa-fw" />{c.veganFriendly ? 'vegan ✔ ' : 'vegan ❌'} </Col>
            <Col> <FontAwesomeIcon icon="cookie" size="2x" className="iconPos fa-fw" />{c.nutAllergyFriendly ? 'nut free  ✔' : 'nut free ❌'} </Col>
          </Row>
        </Container>
        <ColoredLine color="gray" />
        <Container>
          <Row>
            <Col xs={12} md={3}>
              <div className="text-center">
                <Image src={c.host.avatar} className="hostImage" roundedCircle />
              </div>
            </Col>
            <Col xs={12} md={9}>
              <h3>Get to know your host: {c.host.name}</h3>
              <p>
                {c.host.description}
              </p>
            </Col>
          </Row>
        </Container>
        <div className="text-center">
          <LinkContainer to={`/classes/${c.id}/booking`}>
            <Button variant="primary">Book Now</Button>
          </LinkContainer>
        </div>
        </div>
      </Layout>
    );
  } else {
    return <div>Class not found!</div>;
  }
};

export default ClassDetail;
