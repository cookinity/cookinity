import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Accordion, Alert, Button, Card, Col, Nav, Row, Table } from 'react-bootstrap';

import Loader from 'components/Shared/Loader/Loader';
import requireAuth from 'higherOrderComponents/requireAuth';
import { compose } from 'redux';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LinkContainer } from 'react-router-bootstrap';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export const HostManagement = () => {
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchClasses = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        // load all classes for which the currently logged in user is host
        const result = await axios.get('/api/classes', { params: { hostId: auth.me.id } });
        const unformattedClasses = result.data.classes;
        const today = dayjs(new Date());
        const formattedClasses = unformattedClasses.map((c) => {
          c.pastDates = [];
          c.futureDates = [];

          for (const dateString of c.bookableDates) {
            const date = dayjs(dateString);
            if (date.isBefore(today)) {
              c.pastDates.push(date.format('llll'));
            } else {
              c.futureDates.push(date.format('llll'));
            }
          }

          return c;
        });
        setClasses(formattedClasses);
      } catch (err) {
        setIsError(true);
        setErrorMessage(err?.response?.data.message || err.message);
      }
      setIsLoading(false);
    };

    fetchClasses();
  }, []);

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

  if (isLoading) {
    return (
      <Layout>
        <Loader></Loader>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <Row>
          <Col>
            <h1 className="text-center">Your Classes</h1>
            <div>
              {isError && (
                <Alert
                  variant="danger"
                  onClose={() => {
                    setIsError(false);
                    setErrorMessage('');
                  }}
                  dismissible
                >
                  {' '}
                  {errorMessage}
                </Alert>
              )}
              <Table striped bordered hover>
                <thead>{columns}</thead>
                <tbody>{rows}</tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
};

export default compose(requireAuth)(HostManagement);
