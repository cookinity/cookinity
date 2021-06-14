import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';

export default function ClassCard ({ c }) {
  useEffect(() => {
    runHolder('image-class-name');
  });

  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img
        className="image-class-name"
        variant="top"
        src="holder.js/100px180?text=Class Cover Image"
      />
      <Card.Body>
        <Card.Title>{c.title}</Card.Title>
        <Card.Text>{c.description}</Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
};
