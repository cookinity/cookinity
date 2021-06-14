import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Accordion, Button, Card, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

export const ClassesTable = ({ classes }) => {
  const columns = (
    <tr>
      <th>Title</th>
      <th>Category</th>
      <th>Dates</th>
      <th>Actions</th>
    </tr>
  );

  const rows = classes.map((c) => {
    return (
      <tr key={c.id}>
        <td>{c.title}</td>
        <td>{c.category}</td>
        <td>
          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Button} variant="link" eventKey="0">
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
            {c.futureDates.length !== 0 ? (
              <Card>
                <Card.Header>
                  <Accordion.Toggle as={Button} variant="link" eventKey="1">
                    Upcoming Dates
                  </Accordion.Toggle>
                </Card.Header>
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
            <Button variant="primary">
              <FontAwesomeIcon icon={faEdit} /> Edit
            </Button>
          </LinkContainer>
          <Button variant="danger" className="ml-2">
            <FontAwesomeIcon icon={faTrash} /> Delete
          </Button>
        </td>
      </tr>
    );
  });

  return (
    <Table striped bordered hover>
      <thead>{columns}</thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};
