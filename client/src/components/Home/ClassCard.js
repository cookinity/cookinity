import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
export const ClassCard = ({ c }) => {
  useEffect(() => {
    runHolder('image-class-name');
  });

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img className="image-class-name" variant="top" src={c.coverPhoto} />
      <Card.Body>
        <Card.Title>{c.title}</Card.Title>
        <Card.Text>{c.description}</Card.Text>
          <LinkContainer to="/classes/idTest">
            <Button variant="primary">Go somewhere</Button>
          </LinkContainer>
      </Card.Body>
    </Card>
  );
};
