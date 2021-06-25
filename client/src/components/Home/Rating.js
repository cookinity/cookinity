import React, {useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Rating = ({ count, rating, colour, onRating}) => {
    const [clickRating, setClickRating] = useState(0);
    
    const getColour = index => {
        if(clickRating >= index){
            return colour.filled;
        } else if(!clickRating && rating >= index){
            return colour.filled;
        }
        return colour.unfilled;
    }

    const starRating = useMemo(() => {
        return Array(count)
        .fill(0)
        .map((_, i) => i + 1)
        .map( (index) => (
            <FontAwesomeIcon
            key={index}
            className="cursor-pointer"
            icon="star"
            onClick={() => onRating(index)}
            style={{color: getColour(index)}}
            onMouseEnter={() => setClickRating(index)}
            onMouseLeave={() => setClickRating(0)}
            />
        ));
    }, [count, rating, clickRating])

    return(
        <div>
            {starRating}
        </div>
    )
}

Rating.propTypes = {
    count: PropTypes.number,
    rating: PropTypes.number,
    onChange: PropTypes.func,
    colour: {
        filled: PropTypes.string,
        unfilled: PropTypes.string,
    }
}

Rating.defaultProps = {
    count: 5,
    rating: 0,
    colour: {
        filled: "#f5eb3b",
        unfilled: "#DCDCDC",
    }
}

export default Rating

/*
const [rating, setRating] = useState(0);
const [rating2, setRating2] = useState(0);

<div>
<div className = 'row'>
  <div className='col text-center'>
    <h2>Rating</h2>
    <Rating rating={rating} onRating={rate => setRating(rate)} /> 
    <p>Rating - {rating}</p>
    <Rating rating={rating2} onRating={rate => setRating2(rate)} /> 
    <p>Rating - {rating2}</p>
  </div>
</div>
</div>
*/