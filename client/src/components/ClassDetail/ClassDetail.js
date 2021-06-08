import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';
import {Carousel, Container, Row, Col} from 'react-bootstrap'
import './classDetail.scss';


const mockClassDetail = {
    id: 1,
    title: 'Experience Japanese Sushi',
    category: "japanese",
    classDescription: "Sushi Addict? Then this course is for you! Learn the basics of sushi making in two step-by-step sessions, then entertain your friends at home at a fraction of the cost of buying sushi. Fresh, delicious and the most healthy way to eat.  This course will teach you about cutting fish, the basics of making rice, California and maki rolls, gunkanmaki and hand rolls. Once you have learnt to roll your own sushi using a special sushi mat, you get to feast on your own creations. Prepare yourself for a fun and entertaining evening.",
    price: 59,
    dates: [
        new Date("July 4 2021"), 
        new Date("July 5 2021"),
        new Date("July 6 2021"),
        ],
    time: "18:30",
    city: "Munich",
    maxParticipants: 4,
    images: [
      {
        src: "http://lorempixel.com/800/400/food/1"
      },
      {
        src: "http://lorempixel.com/800/400/food/2"
      },
      {
        src: "http://lorempixel.com/800/400/food/3"
      }
    ]
}

const carouselImages = mockClassDetail.images.map(image =>
    <Carousel.Item>
        <img
            className="d-block w-100"
            src= {image.src}
            alt="Cooking Class Inspiration "
        />
    </Carousel.Item>
);


const ClassDetail = () => {
  
    return (
        <Layout>
            <Carousel>
                {carouselImages}
            </Carousel>
            <h1 className = "classTitle">Experience Japanese Course</h1>
            <Container>
                <Row>
                    <Col>1 of 2</Col>
                    <Col>2 of 2</Col>
                </Row>
                <Row>
                    <Col>1 of 2</Col>
                    <Col>2 of 2</Col>
                </Row>
                <Row>
                    <Col>1 of 2</Col>
                    <Col>2 of 2</Col>
                </Row>
            </Container>
        </Layout>
    )
  }
  
  export default compose(requireAuth)(ClassDetail);