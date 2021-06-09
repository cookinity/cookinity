import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(utc);
dayjs.extend(localizedFormat);

const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}


export const ClassCard = ({ c }) => {
  useEffect(() => {
    runHolder('image-class-name');
  });

  const readableDates = c.bookableDates.map(date => {
    return dayjs(date).local().format('YYYY-MM-DD')
  })

  const readableTimes = c.bookableDates.map(date => {
    return dayjs(date).local().format('hh:mm')
  })

  const dates = (<dl>
    {readableDates.map(date => <dd>{date}</dd>)}
  </dl>)

  const times = (<dl>
    {readableTimes.map(date => <dd>{date} (Am Tag XY)</dd>)}
  </dl>)

  const shortdescription = c.description ? truncateString(c.description, 200) : '';

  return (
    <Card border="primary">
      <Card.Img className="image-class-name" variant="top" src={c.coverPhoto} />
      <Card.Body>
        <Card.Title>{c.title}</Card.Title>
        <Card.Subtitle>
          <div>
            <span className="font-weight-bold">Rating: </span>
            {c.rating}
          </div>
        </Card.Subtitle>
        <Card.Text>
          <div>
            {shortdescription}
            <p></p>
          </div>
          <div><span></span></div>
          <div>
            <Card border="primary">
              <Card.Text>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <span className="font-weight-bold">Available Dates: </span>
                    {dates}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Prize: </span>
                    <div>10€</div>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Time: </span>
                    {times}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Participants: </span>
                    <div>2-6</div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Text>
            </Card>
          </div>
        </Card.Text>
        <Button variant="primary" size="lg" block> Find out more</Button>
      </Card.Body>
    </Card >
  );
};
