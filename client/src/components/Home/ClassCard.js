import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ClassCard.scss';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
dayjs.extend(localizedFormat);

export default function ClassCard({ c, filterDate }) {
  const description =
    c.description.length > 200 ? c.description.substring(0, 200) + '...' : c.description;
  const guests = c.minGuests === c.maxGuests ? `${c.minGuests}` : `${c.minGuests}-${c.maxGuests}`;
  const meetingAddress = `${c.meetingAddress.city}, ${c.meetingAddress.street}`;
  const stars = generateStars();
  const bookableDatesAroundOrientationDate = useMemo(() => generateBookableDates(), [c]);

  return (
    <div className="card border-light mb-4 animate-up-5">
      <Link to={`/classes/${c.id}`} className="position-relative">
        <img src={c.coverPhoto} className="card-img-top rounded-xl p-2 image" />
      </Link>
      <div className="card-body">
        <Link to={`/classes/${c.id}`}>
          <h4 className="h5">{c.title}</h4>
        </Link>
        <div>
          <span>{c.category}</span>
        </div>
        <div className="my-2">
          <span>
            <i className="fa fa-map-marker" /> {meetingAddress}
          </span>
        </div>
        <div className="d-flex my-1">{stars}</div>
        <hr></hr>
        {bookableDatesAroundOrientationDate.length > 0 ? (
          <>
            <span>Bookable On: </span>
            <ul>{bookableDatesAroundOrientationDate}</ul>
          </>
        ) : (
          <span>No free dates to book available!</span>
        )}
        <hr></hr>
        <div>
          <p className="mb-0">{description}</p>
        </div>
      </div>
      <div className="card-footer bg-soft border-top">
        <div className="d-flex justify-content-between">
          <div className="col pl-0">
            <span className="text-muted font-small d-block mb-2">Price pp</span>
            <span className="h5 text-dark font-weight-bold">{c.pricePerPerson}€</span>
          </div>
          <div className="col">
            <span className="text-muted font-small d-block mb-2">Guests</span>
            <span className="h5 text-dark font-weight-bold">{guests}</span>
          </div>
          <div className="col pr-0">
            <span className="text-muted font-small d-block mb-2">Duration</span>
            <span className="h5 text-dark font-weight-bold">{c.durationInMinutes} Min</span>
          </div>
        </div>
      </div>
    </div>
  );

  function generateStars() {
    let avgRatingRounded = Math.round((c.avgRating ? c.avgRating : 0) * 2) / 2;
    let numberOfFullStars = ~~avgRatingRounded;
    let hasHalfStar = avgRatingRounded % 1 !== 0;

    const stars = [];
    for (let i = 0; i < numberOfFullStars; i++) {
      stars.push(<i className="star fa fa-star text-warning" key={i} />);
    }
    if (hasHalfStar) {
      stars.push(<i className="star fa fa-star-half-o text-warning" key={numberOfFullStars} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i className="star fa fa-star-o text-warning" key={i} />);
    }
    stars.push(
      <span key="avgRatingBadge" className="badge badge-pill badge-primary ml-2">
        {c.avgRating ? c.avgRating.toFixed(2) : 0}
      </span>,
    );
    return stars;
  }

  function generateBookableDates() {
    // if a filter date is set we take this as an orientation point otherwise the current date
    const orientationDate = filterDate ? dayjs(filterDate.toDate()) : dayjs();
    const bookableTimeSlots = c.timeSlots.filter((ts) => !ts.isBooked);
    // sort bookable time slots by earlierst date first
    bookableTimeSlots.sort((a, b) => {
      const aDate = dayjs(a.date);
      const bDate = dayjs(b.date);
      if (aDate.isBefore(bDate)) {
        return -1;
      }
      if (aDate.isAfter(bDate)) {
        return 1;
      }
      return 0;
    });

    const bookableDatesAroundOrientationDate = [];
    for (let i = 0; i < bookableTimeSlots.length; i++) {
      const timeSlot = bookableTimeSlots[i];
      const date = dayjs(timeSlot.date);
      const diff = Math.abs(date.diff(orientationDate, 'days'));
      if (diff < 3 && !timeSlot.isBooked) {
        bookableDatesAroundOrientationDate.push(
          <li key={date.format('llll')}>{date.format('llll')}</li>,
        );
        if (bookableDatesAroundOrientationDate.length === 3) {
          break;
        }
      }
    }
    return bookableDatesAroundOrientationDate;
  }
}
