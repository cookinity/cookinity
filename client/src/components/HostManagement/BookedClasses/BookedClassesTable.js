
import React from 'react';
import { Table } from 'react-bootstrap';
import dayjs from 'dayjs';

export const BookedClassesTable = ({ bookings}) => {


    const columns = (
        <tr>
            <th>Title</th>
            <th>Total Price</th>
            <th>Guests</th>
            <th>Customer Name</th>
            <th>Customer Email</th>
            <th>Class Date</th>
            <th>Booking Date</th>
        </tr>
        );

    const rows = bookings.map((b) => {
        return (
        <tr key={b.id}>
            <td>{b.class.title}</td>
        <td>{(b.stripeSession.amount_total)/100} {b.currency}</td>
            <td>{b.numberOfGuests}</td>
            <td>{b.customer.username}</td>
            <td>{b.customer.email}</td>
            <td>{dayjs(b.bookedTimeSlot.date).format('llll')}</td>
            <td>{dayjs(b.bookingDate).format('llll')}</td>
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
