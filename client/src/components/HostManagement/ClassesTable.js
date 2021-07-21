import { faEdit, faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Accordion, Button, Card, Modal, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const ClassesTable = ({ classes, onDeleteCallback }) => {
  const [show, setShow] = useState(false);
  const [selectedClass, setSelectedClass] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (c) => {
    return () => {
      setSelectedClass(c);
      setShow(true);
    };
  };

  const columns = (
    <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Price</th>
      <th>Min Guests</th>
      <th>Max Guests</th>
      <th>Duration</th>
      <th>Dates</th>
      <th>Actions</th>
    </tr>
  );

  const rows = classes.map((c) => {
    return (
      <tr key={c.id}>
        <td>{c.title}</td>
        <td>{c.category}</td>
        <td>{c.pricePerPerson} Euro</td>
        <td>{c.minGuests} Guests</td>
        <td>{c.maxGuests} Guests</td>
        <td>{c.durationInMinutes} Minutes</td>
        <td>
          <Accordion>
            {c.pastDates.length !== 0 ? (
              <Card>
                <Card.Header className="dateButton">
                  <Accordion.Toggle as={Button} variant="secondary" className="dateButton" eventKey="0">
                    Past Dates
                  </Accordion.Toggle>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                  <Card.Body>
                    <ul>
                      {c.pastDates.map((date) => (
                        <li key={date}>{date}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ) : (
              ''
            )}
            {c.futureDates.length !== 0 ? (
              <Card>
                <Accordion.Toggle as={Button} variant="secondary" className="dateButton" eventKey="1">
                  Upcoming Dates
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                  <Card.Body>
                    {' '}
                    <ul>
                      {c.futureDates.map((date) => (
                        <li key={date}>{date}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ) : (
              ''
            )}
          </Accordion>
        </td>
        <td>
          <LinkContainer to={`/hostmanagement/edit-class/${c.id}`}>
            <Button variant="primary" className="mr-2 mt-2 marginSmallScreen">
              <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
          </LinkContainer>
          <Button variant="danger" className="mr-2 mt-2 marginSmallScreen" onClick={handleShow(c)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
          <LinkContainer to={`/hostmanagement/edit-class/${c.id}/times`}>
            <Button variant="secondary" className="mt-2 marginSmallScreen">
              <FontAwesomeIcon icon={faClock} />
              {' '}Manage Bookable Times
            </Button>
          </LinkContainer>
        </td>
      </tr>
    );
  });

  return (
    <>
      <Table bordered hover responsive>
        <thead>{columns}</thead>
        <tbody>{rows}</tbody>
      </Table>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {selectedClass ? selectedClass.title : ''}?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Do you really want to delete the class {selectedClass ? selectedClass.title : ''}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onDeleteCallback(selectedClass)}>
            Delete Class
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
