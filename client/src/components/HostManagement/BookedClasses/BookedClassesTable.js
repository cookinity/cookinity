import React from 'react';
import { Button, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const BookedClassesTable = ({ bookings, isPastTable }) => {
  const columns = (
    <tr>
      <th>Title</th>
      <th>Total Price</th>
      <th>Guests</th>
      <th>Customer Name</th>
      <th>Customer Email</th>
      <th>Class Date</th>
      <th>Booking Date</th>
      <th>Actions</th>
    </tr>
  );

  const rows = bookings.map((b) => {
    return (
      <tr key={b.id}>
        <td>{b.class.title}</td>
        <td>
          {b.totalPrice / 100} {b.currency}
        </td>
        <td>{b.numberOfGuests}</td>
        <td>{b.customer.username}</td>
        <td>{b.customer.email}</td>
        <td>{dayjs(b.bookedTimeSlot.date).format('llll')}</td>
        <td>{dayjs(b.bookingDate).format('llll')}</td>
        <td>
          {isPastTable ? (
            <LinkContainer to={`/hostmanagement/booked-classes/${b.id}/create-feedback`}>
              <Button variant="success" disabled={b.reviewedByHost ? true : false}>
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                Rate Guest
              </Button>
            </LinkContainer>
          ) : null}
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table bordered responsive>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
