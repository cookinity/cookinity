import React, { useState } from 'react';
import './FilterSideBar.scss';

const FilterSideBar = ({
  handleFilterRating,
  handleFilterPrice,
  handleFilterCapacity,
  handleVegetarian,
  handleVegan,
  handleNutAllergy,
  handlePescatarian,
  handleEggFree,
  handleSoyFree,
}) => {
  const [selectedRating, setSelectedRating] = useState(undefined);
  const [selectedPriceRange, setSelectedPriceRange] = useState([undefined, undefined]);
  const [selectedNumberOfGuests, setSelectedNumberOfGuests] = useState(undefined);

  const handleGuestCustomChange = (event) => {
    const guests = event.target.value;
    if (guests) {
      setSelectedNumberOfGuests(Number(guests));
      handleFilterCapacity(Number(guests));
    } else {
      setSelectedNumberOfGuests('');
      handleFilterCapacity(undefined);
    }
  };

  const handleRatingSelect = (rating) => {
    return () => {
      if (selectedRating === rating) {
        setSelectedRating(undefined);
        handleFilterRating(undefined);
      } else {
        setSelectedRating(rating);
        handleFilterRating(rating);
      }
    };
  };

  const handlePriceSelect = (priceRange) => {
    return () => {
      if (selectedPriceRange[0] === priceRange[0] && selectedPriceRange[1] === priceRange[1]) {
        setSelectedPriceRange([undefined, undefined]);
        handleFilterPrice([undefined, undefined]);
      } else {
        setSelectedPriceRange(priceRange);
        handleFilterPrice(priceRange);
      }
    };
  };

  const handleNumberOfGuestsSelect = (numberOfGuests) => {
    return () => {
      if (selectedNumberOfGuests === numberOfGuests) {
        setSelectedNumberOfGuests('');
        handleFilterCapacity(undefined);
      } else {
        setSelectedNumberOfGuests(numberOfGuests);
        handleFilterCapacity(numberOfGuests);
      }
    };
  };

  const fourStarsAndMore = generateStars(4);
  const threeStarsAndMore = generateStars(3);
  const twoStarsAndMore = generateStars(2);
  const oneStarAndMore = generateStars(1);

  const belowTwentyFiveEuros = generatePriceRange(1, undefined, 25);
  const twentyFiveEurosUntilFiftyEuros = generatePriceRange(2, 25, 50);
  const fiftyEurosUntilOneHundredEuros = generatePriceRange(3, 50, 100);
  const aboveHundredEuros = generatePriceRange(4, 100, undefined);

  const onePerson = generateGuests(1);
  const twoPersons = generateGuests(2);
  const threePersons = generateGuests(3);
  const fourPersons = generateGuests(4);
  return (
    <div>
      <h5>Filters</h5>

      <div className="filterOrder">
        <div>Overall rating</div>
        <div>{fourStarsAndMore}</div>
        <div>{threeStarsAndMore}</div>
        <div>{twoStarsAndMore}</div>
        <div>{oneStarAndMore}</div>
      </div>

      <div className="mt-2 filterOrder">
        <div>Price per Person</div>
        <div>{belowTwentyFiveEuros}</div>
        <div>{twentyFiveEurosUntilFiftyEuros}</div>
        <div>{fiftyEurosUntilOneHundredEuros}</div>
        <div>{aboveHundredEuros}</div>
      </div>

      <div className="mt-2 filterOrder">
        <div>Number of Guests</div>
        <div>{onePerson}</div>
        <div>{twoPersons}</div>
        <div>{threePersons}</div>
        <div>{fourPersons}</div>
        <input
          className="form-control form-control-sm mt-1 guestInput"
          placeholder="Custom"
          type="number"
          value={selectedNumberOfGuests}
          onChange={handleGuestCustomChange}
          min={1}
        ></input>
      </div>

      <div className="filterOrder">
        <div>Dietary Preference</div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handleVegan(event)}
            type="checkbox"
            id="vegan"
          />
          <label className="form-check-label small" htmlFor="vegan">
            Vegan
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handleVegetarian(event)}
            type="checkbox"
            id="vegetarian"
          />
          <label className="form-check-label small" htmlFor="vegetarian">
            Vegetarian
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handleNutAllergy(event)}
            type="checkbox"
            id="nutAllergy"
          />
          <label className="form-check-label small" htmlFor="nutAllergy">
            Nut free
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handlePescatarian(event)}
            type="checkbox"
            id="pescatarian"
          />
          <label className="form-check-label small" htmlFor="pescatarian">
            Pescatarian
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handleEggFree(event)}
            type="checkbox"
            id="eggfree"
          />
          <label className="form-check-label small" htmlFor="eggfree">
            Egg free
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            onChange={(event) => handleSoyFree(event)}
            type="checkbox"
            id="soyfree"
          />
          <label className="form-check-label small" htmlFor="soyfree">
            Soy free
          </label>
        </div>
      </div>
    </div>
  );
  function generateStars(numberOfFullStars) {
    const stars = [];
    for (let i = 0; i < numberOfFullStars; i++) {
      stars.push(<i className="star fa fa-star text-warning" key={i} />);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i className="star fa fa-star-o text-warning" key={i} />);
    }
    stars.push(
      <span className="small px-2" key={`${numberOfFullStars} - More`}>
        & More
      </span>,
    );

    return (
      <div
        style={{ color: selectedRating === numberOfFullStars ? 'dodgerblue' : 'black' }}
        className="pointer"
        onClick={handleRatingSelect(numberOfFullStars)}
      >
        {stars}
      </div>
    );
  }

  function generatePriceRange(numberOfEuros, min, max) {
    const euros = [];
    for (let i = 0; i < numberOfEuros; i++) {
      euros.push(<i className="fa fa-eur" key={i} />);
    }
    // create price range text
    let priceRange = '';
    if (min === undefined && max !== undefined) {
      priceRange = `below ${max}€`;
    } else if (min !== undefined && max === undefined) {
      priceRange = `above ${min}€`;
    } else if (min !== undefined && max !== undefined) {
      priceRange = `between ${min}€ and ${max}€`;
    }

    euros.push(
      <span className="small px-2" key={`${numberOfEuros} - More`}>
        {priceRange}
      </span>,
    );

    return (
      <div
        style={{
          color:
            min === selectedPriceRange[0] && max === selectedPriceRange[1] ? 'dodgerblue' : 'black',
        }}
        className="pointer"
        onClick={handlePriceSelect([min, max])}
      >
        {euros}
      </div>
    );
  }

  function generateGuests(numberOfPersons) {
    const persons = [];
    for (let i = 0; i < numberOfPersons; i++) {
      persons.push(<i className="fa fa-male" key={i} />);
    }
    // create price range text
    let personText = `${numberOfPersons}`;

    persons.push(
      <span className="small px-2" key={`${numberOfPersons} - More`}>
        {personText}
      </span>,
    );

    return (
      <div
        style={{
          color: numberOfPersons === selectedNumberOfGuests ? 'dodgerblue' : 'black',
        }}
        className="pointer"
        onClick={handleNumberOfGuestsSelect(numberOfPersons)}
      >
        {persons}
      </div>
    );
  }
};

export default FilterSideBar;
