import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { Accordion, Button, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const ClassesTable = ({ classes }) => {
  const [show, setShow] = useState(false);
  const [selectedClass, setSelectedClass] = useState(undefined);

  const handleClose = () => setShow(false);
  const handleShow = (c) => {
    return () => {
      setSelectedClass(c);
      setShow(true);
    };
  };

  //Min Guests ersetzten durch gebuchte leute
  //E-Mail host etc.
  const columns = (
    <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Price</th>
      <th>Guests</th>
      <th>Duration</th>
      <th>Actions</th>
    </tr>
  );

  const rows = classes.map((c) => {
    return (
      <tr key={c.id}>
        <td>{c.title}</td>
        <td>{c.category}</td>
        <td>{c.pricePerPerson} Euro</td>
        <td>Guests missing</td>
        <td>{c.durationInMinutes} Minutes</td>
        <td>
          <LinkContainer to={`/classes/${c.id}`}>
            <Button className="mr-1" variant="info">
              <FontAwesomeIcon icon="info-circle" /> Go to Course
            </Button>
          </LinkContainer>
          {c.pastDates.length !== 0 ? (
            <LinkContainer to={`/classes/${c.id}/create-feedback`}>
              <Button className="mr-1" variant="sucess">
                <FontAwesomeIcon icon={faPlus} /> Give Feedback
              </Button>
            </LinkContainer>
          ) : (
            ''
          )}
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
