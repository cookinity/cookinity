import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Accordion, Button, Card, Modal, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';

export const ClassesTableYourBookings = ({ yourbookings }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
            <Button className="mr-1" variant="info">
              <FontAwesomeIcon icon="info-circle" /> {b.host.name}
            </Button>
          </LinkContainer>
        </td>
        <td>
          <LinkContainer to={`/classes/${b.class.id}`}>
            <Button className="mr-1 mb-1" variant="info">
              <FontAwesomeIcon icon="info-circle" /> Go to Course
            </Button>
          </LinkContainer>
          {b.privateInformation ? (
            <>
              <Button variant="warning" onClick={handleShow}>
                View Private Information
              </Button>

              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Private Information From The Host</Modal.Title>
                </Modal.Header>
                <Modal.Body>{b.privateInformation}</Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
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
