import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

// TODO: Please restrict available dates and do not show all of them. Maybe only the two closest to the current date?
// Simply sort by date, eliminate the ones in the past and pick the first two.


const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

const getRating = function (res) {
  if (res == -1) {
    return "No Feedback given"
  } else {
    return res;
  }
};

export default function ClassCard({ c }) {
  useEffect(() => {
    runHolder('image-class-name');
  });

  const shortdescription = c.description ? truncateString(c.description, 200) : '';
  const allratings = c.feedbacks;
  let sum = 0;
  for (var i = 0; i < allratings.length; i++) {
    sum = sum + allratings[i].overallRatingStars
  }
  let classrating = -1;
  if (allratings.length > 0) {
    classrating = sum / allratings.length;
  }
  return (
    <Card border="primary" className="mb-3 shadow classCard">
      <Card.Img className="image-class-name" variant="top" src={c.coverPhoto} />
      <Card.Body>
        <Card.Title>{c.title}</Card.Title>
        <Card.Subtitle></Card.Subtitle>
        <Card.Text>
          <div>
            {shortdescription}
            <p></p>
          </div>
          <div>
            <Card border="primary">
              <Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="font-weight-bold">Rating: </span>
                    {getRating(classrating)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Available Dates: </span>
                    Dates missing
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Price: </span>
                    <div>{c.pricePerPerson}€</div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Participants: </span>
                    <div>
                      {c.minGuests}-{c.maxGuests}
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Text>
            </Card>
          </div>
        </Card.Text>
        <LinkContainer to={`/classes/${c.id}`}>
          <Button variant="primary" block>Go to course</Button>
        </LinkContainer>
        <LinkContainer to={`/classes/${c.id}/create-feedback`}>
          <Button variant="primary" block>Go to feedback</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
