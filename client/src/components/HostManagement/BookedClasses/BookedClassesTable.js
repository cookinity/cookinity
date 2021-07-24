import React from 'react';
import { Button, Table } from 'react-bootstrap';
import dayjs from 'dayjs';
import { LinkContainer } from 'react-router-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export const BookedClassesTable = ({ bookings, isPastTable }) => {
  const columns = (
    <tr>
      <th>Class</th>
      <th>Price</th>
      <th>Number of Guests</th>
      <th>Customer</th>
      <th>Class On</th>
      <th>Booked On</th>
      {isPastTable ? <th>Action</th> : null}
    </tr>
  );

  const rows = bookings.map((b) => {
    const totalPrice = b.totalPrice;
    const fee = 0.1 * b.totalPrice;
    const takeHome = totalPrice - fee;
    const priceString = `${(totalPrice / 100).toFixed(2)}€ (Fee: ${(fee / 100).toFixed(
      2,
    )}€ Yours: ${(takeHome / 100).toFixed(2)}€)`;

    return (
      <tr key={b.id}>
        <td>
          <Link to={`/classes/${b.class.id}`}>{b.class.title}</Link>
        </td>
        <td>{priceString}</td>
        <td>{b.numberOfGuests}</td>
        <td>
          <Link to={`/${b.customer.username}`}>{b.customer.username}</Link>
        </td>
        <td>{dayjs(b.bookedTimeSlot.date).format('llll')}</td>
        <td>{dayjs(b.bookingDate).format('llll')}</td>
        {isPastTable ? (
          <td>
            <LinkContainer to={`/hostmanagement/booked-classes/${b.id}/create-feedback`}>
              <Button variant="success" disabled={b.reviewedByHost ? true : false}>
                <FontAwesomeIcon icon={faPlus} className="mr-1" />
                {b.reviewedByHost ? 'Already Rated' : 'Rate Guest'}
              </Button>
            </LinkContainer>
          </td>
        ) : null}
      </tr>
    );
  });

  return (
    <>
      <Table responsive>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};
