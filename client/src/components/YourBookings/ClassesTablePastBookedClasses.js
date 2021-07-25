import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Accordion, Button, Card, Modal, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

export const ClassesTablePastBookedClasses = ({ yourbookings }) => {
  const [show, setShow] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = (b) => {
    setShow(true);
    setModalContent(b.privateInformation);
  };

  const columns = (
    <tr>
      <th>Title</th>
      <th>Starting Time</th>
      <th>Meeting Location</th>
      <th>Duration</th>
      <th>Number of Guests</th>
      <th>Total Price</th>
      <th>Host E-Mail</th>
      <th>Actions</th>
    </tr>
  );

  const rows = yourbookings.map((b) => {
    const priceineuro = b.totalPrice / 100;
    return (
      <tr key={b.id}>
        <td>
          <Link to={`/classes/${b.class.id}`} className="hoverLink">
            {b.class.title}
          </Link>
        </td>
        <td>{dayjs(b.bookedTimeSlot.date).format('llll')}</td>
        <td>
          {b.class.meetingAddress.street +
            ', ' +
            b.class.meetingAddress.zip +
            ' ' +
            b.class.meetingAddress.city}
        </td>
        <td>{b.class.durationInMinutes} Minutes</td>
        <td>{b.numberOfGuests}</td>
        <td>{priceineuro} Euro</td>
        <td>
          <Link to={`/${b.host.username}`} className="hoverLink">
            {b.host.email}
          </Link>
        </td>
        <td>
          {b.privateInformation ? (
            <Button variant="warning" className="mr-1 mt-1" onClick={() => handleShow(b)}>
              View Contact Details
            </Button>
          ) : null}

          <LinkContainer to={`/classes/${b.class.id}/bookings/create-feedback/${b.id}`}>
            <Button
              className="mr-1 mt-1"
              variant="success"
              disabled={b.reviewedByCustomer ? true : false}
            >
              <FontAwesomeIcon icon={faPlus} /> Rate Class
            </Button>
          </LinkContainer>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table responsive>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalContent}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
