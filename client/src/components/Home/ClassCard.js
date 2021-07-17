import React from 'react';
import { Button, Card, ListGroup } from 'react-bootstrap';
import { run as runHolder } from 'holderjs/holder';
import { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';

const truncateString = function (str, num) {
  if (str.length > num) {
    return str.slice(0, num) + '...';
  } else {
    return str;
  }
};

const getRating = function (res) {
  if (res == -1) {
    return 'No Feedback given';
  } else if (res < 1) {
    //Error Handling
    return 'Something with the feedback went wrong.';
  } else if (res < 1.25) {
    //1 Stern
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 1.75) {
    //1.5 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-half-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 2.25) {
    //2 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 2.75) {
    //2.5 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-half-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 3.25) {
    //3 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 3.75) {
    //3.5 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-half-o text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 4.25) {
    //4 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-o text-warning"></i>
      </div>
    );
  } else if (res < 4.75) {
    //4.5 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star-half-o text-warning"></i>
      </div>
    );
  } else if (res <= 5) {
    //5 Sterne
    return (
      <div>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
        <i className="fa fa-star text-warning"></i>
      </div>
    );
  } else {
    //Error Handling
    return 'Something with the feedback went wrong.';
  }
};

const getDates = function (c) {
  if (c != null) {
    const alldates = [];
    for (var i = 0; i < c.timeSlots.length; i++) {
      let date = c.timeSlots[0].date;
      alldates.push(date);
    }
    return alldates;
  }
};

const filterDates = function (filterdate, c) {
  if (filterdate != null) {
    return getDates(c);
  } else {
    return filterdate;
  }
};

export default function ClassCard({ c, date }) {
  useEffect(() => {
    runHolder('image-class-name');
  });
  const startDate = date;
  const shortdescription = c.description ? truncateString(c.description, 200) : '';
  const allratings = c.feedbacks;
  let sum = 0;
  for (var i = 0; i < allratings.length; i++) {
    sum = sum + allratings[i].overallRatingStars;
  }
  let classrating = -1;
  if (allratings.length > 0) {
    classrating = sum / allratings.length;
  }
  return (
    <Card border="primary" className="shadow classCard">
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
                    {filterDates(startDate, c)}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <span className="font-weight-bold">Price: </span>
                    {c.pricePerPerson}€
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
          <Button variant="primary" block>
            Go to course
          </Button>
        </LinkContainer>
      </Card.Body>
    </Card>
  );
}
