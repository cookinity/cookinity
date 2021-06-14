import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import './classDetail.scss';
import { BsCalendar, BsClock, BsPeople, BsFillExclamationCircleFill } from 'react-icons/bs';
import { RiMoneyEuroCircleLine } from 'react-icons/ri';
import { MdLocationOn } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const mockClassDetail = {
  id: 1,
  title: 'Experience Japanese Sushi',
  category: 'japanese',
  classDescription:
    'Sushi Addict? Then this course is for you! Learn the basics of sushi making in two step-by-step sessions, then entertain your friends at home at a fraction of the cost of buying sushi. Fresh, delicious and the most healthy way to eat.  This course will teach you about cutting fish, the basics of making rice, California and maki rolls, gunkanmaki and hand rolls. Once you have learnt to roll your own sushi using a special sushi mat, you get to feast on your own creations. Prepare yourself for a fun and entertaining evening.',
  price: 59,
  dates: [new Date('July 4 2021'), new Date('July 5 2021'), new Date('July 6 2021')],
  time: '18:30',
  city: 'Munich',
  minParticipants: 2,
  maxParticipants: 4,
  dietaryPreferences: 'egg free, no peanuts',
  images: [
    {
      src: 'http://lorempixel.com/800/400/food/1',
    },
    {
      src: 'http://lorempixel.com/800/400/food/2',
    },
    {
      src: 'http://lorempixel.com/800/400/food/3',
    },
  ],
};

function dateToString(date) {
  var day = date.getUTCDate();
  var month = date.getUTCMonth();
  var year = date.getUTCFullYear();
  return day + '/' + month + '/' + year;
}

const carouselImages = mockClassDetail.images.map((image, index) => (
  <Carousel.Item key={index} interval={3000} className="carouselImage">
    <img className="d-block w-100" src={image.src} alt="Cooking Class Inspiration " />
  </Carousel.Item>
));

const ClassDetail = () => {
  const [c, setClass] = useState(undefined);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // id of the class in the route
  let { classId } = useParams();

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

  if (c) {
    return (
      <Layout>
        <Carousel>{carouselImages}</Carousel>
        <h1 className="classTitle">{c.title}</h1>
        <Container>
          <Row className="rowFormat">
            <Col className="classDetail">
              <BsCalendar size={32} className="iconPos" /> {dateToString(mockClassDetail.dates[0])}
            </Col>
            <Col className="classDetail">
              <RiMoneyEuroCircleLine size={32} className="iconPos" />{' '}
              {mockClassDetail.price.toString()} € per person
            </Col>
          </Row>
          <Row className="rowFormat">
            <Col className="classDetail">
              <BsClock size={32} className="iconPos" /> {mockClassDetail.time}
            </Col>
            <Col className="classDetail">
              <BsPeople size={32} className="iconPos" /> {mockClassDetail.minParticipants} -{' '}
              {mockClassDetail.maxParticipants} persons
            </Col>
          </Row>
          <Row className="rowFormat">
            <Col className="classDetail">
              <MdLocationOn size={32} className="iconPos" /> {mockClassDetail.city}
            </Col>
            <Col className="classDetail">
              <BsFillExclamationCircleFill size={32} className="iconPos" />{' '}
              {mockClassDetail.dietaryPreferences}
            </Col>
          </Row>
        </Container>
        <Row className="rowFormat">{mockClassDetail.classDescription}</Row>
      </Layout>
    );
  } else {
    return <div>Class not found!</div>;
  }
};

export default ClassDetail;
