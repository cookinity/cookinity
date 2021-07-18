import React from 'react';
import { Form, Button } from 'react-bootstrap';

const FilterSideBar = ({
  handleFilterRating,
  starRating4,
  starRating3,
  starRating2,
  starRating1,
  handleFilterPrice,
  priceUnder25,
  priceUnder50,
  priceUnder100,
  priceOver100,
  handleFilterCapacity,
  clearCapacityFilter,
  handleFilterPriceMinField,
  handleFilterPriceMaxField,
  fetchClasses,
  handleVegetarian,
  handleVegan,
  handleNutAllergy,
  handlePescatarian,
  handleEggFree,
  handleSoyFree,
}) => {
  return (
    <Form>
    <a>
      <h5>Filters</h5>
    </a>

    <a>
      <label htmlFor="averageRating" className="form-label">
        Overall rating
      </label>

      <li
        id="starRating4"
        className="list-group pointer"
        onClick={() => handleFilterRating(starRating4, 4)}
      >
        <div className="row col-auto">
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <p className="small px-2">& More</p>
        </div>
      </li>

      <li
        id="starRating3"
        className="list-group pointer"
        onClick={() => handleFilterRating(starRating3, 3)}
      >
        <div className="row col-auto">
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <p className="small px-2">& More</p>
        </div>
      </li>
      <li
        id="starRating2"
        className="list-group pointer"
        onClick={() => handleFilterRating(starRating2, 2)}
      >
        <div className="row col-auto">
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <p className="small px-2">& More</p>
        </div>
      </li>
      <li
        id="starRating1"
        className="list-group pointer"
        onClick={() => handleFilterRating(starRating1, 1)}
      >
        <div className="row col-auto">
          <i className="fa fa-star text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <i className="fa fa-star-o text-warning"></i>
          <p className="small px-2">& More</p>
        </div>
      </li>
    </a>
   
    <a>
      <label htmlFor="price" className="form-label">
        Price
      </label>
      <li
        id="priceUnder25"
        className="list-group pointer"
        onClick={() => handleFilterPrice(priceUnder25, 1, 25)}
      >
        <div className="row col-auto">
          <i className="fa fa-eur"></i>
          <p className="small px-2">1 - 25€</p>
        </div>
      </li>
      <li
        id="priceUnder50"
        className="list-group pointer"
        onClick={() => handleFilterPrice(priceUnder50, 26, 50)}
      >
        <div className="row col-auto">
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <p className="small px-2">26 - 50€</p>
        </div>
      </li>
      <li
        id="priceUnder100"
        className="list-group pointer"
        onClick={() => handleFilterPrice(priceUnder100, 51, 100)}
      >
        <div className="row col-auto">
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <p className="small px-2">51 - 100€</p>
        </div>
      </li>
      <li
        id="priceOver100"
        className="list-group pointer"
        onClick={() => handleFilterPrice(priceOver100, 100, 1000)}
      >
        <div className="row col-auto">
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <i className="fa fa-eur"></i>
          <p className="small px-2">over 100€</p>
        </div>
      </li>
      <div className="row col-auto">
      <div className="d-flex ">
        <input
          placeholder="Min"
          type="number"
          className="form-control custom-width-min-max"
          min="1"
          max="1000"
          onChange={handleFilterPriceMinField}
        />
        <p className="px-2">-</p>
        <input
          placeholder="Max"
          type="number"
          className="form-control custom-width-min-max"
          min="1"
          max="1000"
          onChange={handleFilterPriceMaxField}
        />
      </div>
      <p>&nbsp;</p>
      <Button onClick={fetchClasses}>Go</Button>
      </div>
    </a>

    <a>
      <label htmlFor="customRange" className="form-label">
        Number of participants
      </label>
      <div className="row col-auto">
        <label>1</label>
        <input
          type="range"
          id="customRange"
          min="1"
          max="10"
          step="1"
          onChange={handleFilterCapacity}
        />
        <label>10</label>
        <p>&nbsp;</p>
        <div className="d-flex ">
          <input id="amount" type="number" className="form-control custom-width" disabled />
        </div>
        <Button onClick={clearCapacityFilter}>Clear</Button>
      </div>
    </a>

    <a>
      <label htmlFor="vegan" className="form-label">
        Dietary preference
      </label>
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
    </a>
    <p>&nbsp;</p>
    </Form>
  );
};

export default FilterSideBar;
