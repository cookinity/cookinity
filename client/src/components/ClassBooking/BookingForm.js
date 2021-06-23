import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import _ from 'lodash';
import NumberFormat from 'react-number-format';

import axios from 'axios';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

const BookingForm = ({ c, submitCallback }) => {
  const [timeSlot, setTimeSlot] = useState(undefined);
  const [timeSlots, setTimeSlots] = useState([]);
  const [numberOfGuestsPossible, setSelectedNumberOfGuestsPossible] = useState([]);
  const [numberOfGuests, setNumberOfGuests] = useState(undefined);

  const [totalPrice, setTotalPrice] = useState(undefined);
  const [marketPlaceFee, setMarketPlaceFee] = useState(undefined);
  const [classPrice, setClassPrice] = useState(undefined);

  useEffect(() => {
    // time slot calculation
    const timeSlotsToConsider = [];
    c.timeSlots.forEach((ts) => {
      const date = dayjs(ts.date);
      if (!ts.isBooked && date.isAfter(dayjs())) {
        timeSlotsToConsider.push(ts);
      }
    });

    timeSlotsToConsider.sort((a, b) => {
      const aDate = dayjs(a.date);
      const bDate = dayjs(b.date);
      if (aDate.isBefore(bDate)) {
        return -1;
      } else if (aDate.isAfter(bDate)) {
        return +1;
      } else {
        return 0;
      }
    });

    setTimeSlots([...timeSlotsToConsider]);
    setTimeSlot(timeSlotsToConsider[0]);

    // number of guests calculation
    const guestPossibilities = [];
    for (let index = c.minGuests; index <= c.maxGuests; index++) {
      guestPossibilities.push(index);
    }
    setSelectedNumberOfGuestsPossible([...guestPossibilities]);
    setNumberOfGuests(guestPossibilities[0]);

    // calculate prices
    const cP = (c.pricePerPerson * guestPossibilities[0]).toFixed(2);
    setClassPrice(cP);
    const mP = (Number(cP) * 0.1).toFixed(2);
    setMarketPlaceFee(mP);
    const tP = Number(cP) + Number(mP);
    setTotalPrice(tP);
  }, [c]);

  //guest options
  let guestOptions = numberOfGuestsPossible.map((number) => <option key={number}>{number}</option>);

  // booking options
  let bookingOptions = timeSlots.map((ts) => (
    <option key={ts.id} value={ts.id}>
      {dayjs(ts.date).format('llll')}
    </option>
  ));

  const handleTimeSlotChange = (event) => {
    const timeSlotId = event.target.value;
    const timeSlot = timeSlots.find((ts) => ts.id === timeSlotId);
    setTimeSlot(timeSlot);
  };

  const handleGuestChange = (event) => {
    setNumberOfGuests(event.target.value);

    // calculate prices when the number guests is updated
    const cP = (c.pricePerPerson * event.target.value).toFixed(2);
    setClassPrice(cP);
    const mP = (Number(cP) * 0.1).toFixed(2);
    setMarketPlaceFee(mP);
    const tP = Number(cP) + Number(mP);
    setTotalPrice(tP);
  };

  return (
    <>
      <Form className="mx-auto">
        <h1>{c.title}</h1>
        <h2>{c.pricePerPerson} Euro per Person</h2>
        <p>{c.durationInMinutes} Minutes</p>
        <p className="supporting-text">{c.description}</p>
        <hr></hr>
        <Form.Group controlId="numberOfGuests">
          <Form.Label>Select the Number of Guests</Form.Label>
          <Form.Control as="select" onChange={handleGuestChange}>
            {guestOptions}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="bookableDates">
          <Form.Label>Select A Date</Form.Label>
          <Form.Control as="select" onChange={handleTimeSlotChange}>
            {bookingOptions}
          </Form.Control>
        </Form.Group>
        <hr />
        <ul>
          <li>
            Cooking Class Price
            <span className="ml-2">
              <NumberFormat value={classPrice} displayType={'text'} thousandSeparator={true} />€
            </span>
          </li>
          <li>
            Market Place Fee
            <span className="ml-2">
              <NumberFormat value={marketPlaceFee} displayType={'text'} thousandSeparator={true} />€
            </span>
          </li>
        </ul>
        <hr />
        <span className="font-weight-bold">
          Total Price{' '}
          <NumberFormat value={totalPrice} displayType={'text'} thousandSeparator={true} />€
        </span>
        <hr></hr>
        <div>
          <Button variant="primary" onClick={submitCallback(timeSlot, numberOfGuests)}>
            Book now
          </Button>
        </div>
      </Form>
    </>
  );
};

export default BookingForm;
