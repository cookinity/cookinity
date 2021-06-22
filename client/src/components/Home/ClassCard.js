import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { LinkContainer } from 'react-router-bootstrap';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

// TODO: Please look in the console Johannes. There are a LOT of exceptions and nesting errors and fix them! Signed Stefan
// TODO: Plese try to make every card the same size.
// TODO: Please restrict available dates and do not show all of them. Maybe only the two closest to the current date?
// Simply sort by date, eliminate the ones in the past and pick the first two.
//

const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

export default function ClassCard({ c }) {
  useEffect(() => {
    runHolder('image-class-name');
  });

  const readableDates = c.bookableDates.map((date) => {
    return dayjs(date).local().format('LLLL');
  });

  const readableTimes = c.bookableDates.map((date) => {
    return dayjs(date).local().format('hh:mm');
  });

  const dates = (
    <dl>
      {readableDates.map((date) => (
        <dd>{date}</dd>
      ))}
    </dl>
  );

  const times = (
    <dl>
      {readableTimes.map((date) => (
        <dd>{date} (Am Tag XY)</dd>
      ))}
    </dl>
  );

  const shortdescription = c.description ? truncateString(c.description, 200) : '';

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
            <span></span>
          </div>
          <div>
            <Card border="primary">
              <Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="font-weight-bold">Rating: </span>
                    {c.rating}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Available Dates: </span>
                    {dates}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Prize: </span>
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
        <LinkContainer to={`/create-feedback`}>
          <Button variant="primary" block>Go to feedback</Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
