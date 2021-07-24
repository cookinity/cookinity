import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const Rating = ({ count, rating, colour, onRating }) => {
  const [clickRating, setClickRating] = useState(0);

  const getColour = (index) => {
    if (clickRating >= index) {
      return colour.filled;
    } else if (!clickRating && rating >= index) {
      return colour.filled;
    }
    return colour.unfilled;
  };

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((index) => (
        <i
          key={index}
          className="fa fa-star cursor-pointer"
          onClick={() => onRating(index)}
          style={{ color: getColour(index) }}
          onMouseEnter={() => setClickRating(index)}
          onMouseLeave={() => setClickRating(0)}
        ></i>
      ));
  }, [count, rating, clickRating]);

  return <div>{starRating}</div>;
};

Rating.propTypes = {
  count: PropTypes.number,
  rating: PropTypes.number,
  onChange: PropTypes.func,
  colour: {
    filled: PropTypes.string,
    unfilled: PropTypes.string,
  },
};

Rating.defaultProps = {
  count: 5,
  rating: 0,
  colour: {
    filled: '#f5eb3b',
    unfilled: '#DCDCDC',
  },
};

export default Rating;
