import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Accordion, Button, Card, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';

export const ClassesTablePastBookedClasses = ({ yourbookings }) => {

  const columns = (
    <tr>
      <th>Title</th>
      <th>Class Date</th>
      <th>Duration</th>
      <th>Persones Booked</th>
      <th>Total Price</th>
      <th>Host contact</th>
      <th>Host</th>
      <th>Actions</th>
    </tr>
  );

  const rows = yourbookings.map((b) => {
    const priceineuro = b.totalPrice / 100;
    return (
      <tr key={b.id}>
        <td>{b.class.title}</td>
        <td>{dayjs(b.bookedTimeSlot.date).format('llll')}</td>
        <td>{b.class.durationInMinutes}</td>
        <td>{b.numberOfGuests}</td>
        <td>{priceineuro} Euro</td>
        <td>{b.host.email}</td>
        <td>
          <LinkContainer to={`/${b.host.username}`}>
            <Button className="mr-1 mt-1" variant="info">
              <FontAwesomeIcon icon="info-circle" /> {b.host.name}
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer to={`/classes/${b.class.id}`}>
            <Button className="mr-1 mt-1" variant="info">
              <FontAwesomeIcon icon="info-circle" /> Go to Course
            </Button>
          </LinkContainer>
          <LinkContainer to={`/classes/${b.class.id}/create-feedback`}>
            <Button className="mr-1 mt-1" variant="success">
              <FontAwesomeIcon icon={faPlus} /> Give Feedback
            </Button>
          </LinkContainer>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table striped bordered hover>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
