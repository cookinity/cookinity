import React, { useEffect, useState } from 'react';
import { Button, Form, Image } from 'react-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import _ from 'lodash';
import NumberFormat from 'react-number-format';
import './BookingForm.scss';

import axios from 'axios';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

const BookingForm = ({ c, submitCallback }) => {
  const [timeSlot, setTimeSlot] = useState(undefined);
  const [timeSlots, setTimeSlots] = useState([]);
  const [numberOfGuestsPossible, setSelectedNumberOfGuestsPossible] = useState([]);
  const [numberOfGuests, setNumberOfGuests] = useState(undefined);

  const [total, setTotal] = useState(undefined);
  const [fee, setFee] = useState(undefined);
  const [host, setHost] = useState(undefined);

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
    const total = (c.pricePerPerson * guestPossibilities[0]).toFixed(2);
    setTotal(total);
    const fee = (Number(total) * 0.1).toFixed(2);
    setFee(fee);
    const host = (Number(total) - Number(fee)).toFixed(2);
    setHost(host);
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
    const total = (c.pricePerPerson * event.target.value).toFixed(2);
    setTotal(total);
    const fee = (Number(total) * 0.1).toFixed(2);
    setFee(fee);
    const host = (Number(total) - Number(fee)).toFixed(2);
    setHost(host);
  };

  return (
    <>
      {timeSlots && timeSlots.length > 0 ? (
        <Form className="mx-auto">
          <h1>{c.title}</h1>
          <p>{c.durationInMinutes} Minutes</p>
          <div className="centerImg">
            <Image className="classCoverPhoto" src={c.coverPhoto} rounded />
          </div>
          <h6>Description</h6>
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
          Split:
          <ul>
            <li>
              To The Host Goes (90%):
              <span className="ml-2">
                <NumberFormat value={host} displayType={'text'} thousandSeparator={true} />€
              </span>
            </li>
            <li>
              To Cookinity Goes (10%):
              <span className="ml-2">
                <NumberFormat value={fee} displayType={'text'} thousandSeparator={true} />€
              </span>
            </li>
          </ul>
          <hr />
          <div className="totalPrice">
            Total Price <NumberFormat value={total} displayType={'text'} thousandSeparator={true} />
            € (Per Person:{' '}
            <NumberFormat
              value={c.pricePerPerson.toFixed(2)}
              displayType={'text'}
              thousandSeparator={true}
            />
            €)
          </div>
          <hr></hr>
          <div className="text-center">
            <Button variant="primary" onClick={submitCallback(timeSlot, numberOfGuests)}>
              Confirm and Pay
            </Button>
          </div>
        </Form>
      ) : (
        <div className="alert alert-warning mx-auto text-center" role="alert">
          <span>🥺 We are sorry! There are currently no time slots free for this class! 🥺</span>
          <br />
          <span>💡 Try a different class! 💡</span>
          <br />
          <span>🍽️ Maybe even try hosting your own cooking class 🍽️ </span>
        </div>
      )}
    </>
  );
};

export default BookingForm;
