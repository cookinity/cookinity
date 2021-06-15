import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { Carousel, Container, Row, Col, Image, Button } from 'react-bootstrap';
import './classDetail.scss';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function dateToString(date) {
  var day = date.getUTCDate();
  var month = date.getUTCMonth();
  var year = date.getUTCFullYear();
  return day + '/' + month + '/' + year;
}

function parseDate(dates) {
  return dates.map((d) => dayjs(d));
}

function formatAddress(adress) {
  return adress.street + ', ' + adress.zip + ' ' + adress.city;
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

  const carouselImages = photos.map((src) => (
    <Carousel.Item interval={3000}>
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
        result.data.class.bookableDates = parseDate(result.data.class.bookableDates);
        setClass(result.data.class);
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
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };
    fetchClass();
  }, []);

  if (c) {
    console.log('object:', c);
    return (
      <Layout>
        <Carousel>{carouselImages}</Carousel>
        <h1 className="classTitle">{c.title}</h1>
        <Container>
          <Row className="rowFormat">
            <Col className="classDetail" xs={8}>
              <FontAwesomeIcon icon="calendar-alt" size="2x" className="iconPos fa-fw" />{' '}
              {c.bookableDates[0].format('DD/MM/YYYY')}
            </Col>
            <Col className="classDetail" xs={4}>
              <FontAwesomeIcon icon="euro-sign" size="2x" className="iconPos fa-fw" />{' '}
              {c.pricePerPerson} € per person
            </Col>
          </Row>
          <Row className="rowFormat">
            <Col className="classDetail" xs={8}>
              <FontAwesomeIcon icon="clock" size="2x" className="iconPos fa-fw" />{' '}
              {c.bookableDates[0].format('HH:mm')}
            </Col>
            <Col className="classDetail" xs={4}>
              <FontAwesomeIcon icon="users" size="2x" className="iconPos fa-fw" /> {c.minGuests} -{' '}
              {c.maxGuests} persons
            </Col>
          </Row>
          <Row className="rowFormat">
            <Col className="classDetail" xs={8}>
              <FontAwesomeIcon icon="map-marker-alt" size="2x" className="iconPos fa-fw" />{' '}
              {formatAddress(c.meetingAddress)}
            </Col>
            <Col className="classDetail" xs={4}>
              <FontAwesomeIcon icon="check-circle" size="2x" className="iconPos fa-fw" />
              {c.vegetarianFriendly ? 'vegetarian, ' : ''}
              {c.veganFriendly ? 'vegan, ' : ''}
              {c.nutAllergyFriendly ? 'nut free' : ''}
            </Col>
          </Row>
        </Container>
        <ColoredLine color="gray" />
        <h3>Description</h3>
        <Row className="rowFormat">{c.description}</Row>
        <ColoredLine color="gray" />
        <h3>What to bring</h3>
        <Row className="rowFormat">{c.toBring}</Row>
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
                Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod
                tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero
                eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea
                takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet,
                consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
                dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo
                dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem
                ipsum dolor sit amet.
              </p>
            </Col>
          </Row>
        </Container>
        <div className="text-center">
          <Button variant="primary" size="lg">
            Book Now
          </Button>
        </div>
      </Layout>
    );
  } else {
    return <div>Class not found!</div>;
  }
};

export default ClassDetail;
