import React from 'react';
import { Button } from 'react-bootstrap';

const FilterBar = ({}) => {
  return (
    <div id="sidebar" className="sidebar">
      <a>
        <h5>Filters</h5>
      </a>

      <a>
        <label htmlFor="averageRating" className="form-label">
          Average rating
        </label>

        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-star text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
            <i className="fa fa-star-o text-warning"></i>
          </div>
        </li>
      </a>

      <br></br>
      <a>
        <label htmlFor="price" className="form-label">
          Price
        </label>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-eur"></i>
            <p className="small px-2">under 25€</p>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <p className="small px-2">under 50€</p>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <p className="small px-2">under 100€</p>
          </div>
        </li>
        <li className="list-group">
          <div className="row col-auto">
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <i className="fa fa-eur"></i>
            <p className="small px-2">under 250€</p>
          </div>
        </li>
      </a>

      <a>
        <label htmlFor="customRange" className="form-label">
          Capacity
        </label>
        <div className="row col-auto">
          <label>1</label>
          <input type="range" id="customRange" min="1" max="10" step="1" />
          <label>10</label>
          <input
            placeholder="Number of persons"
            id="amount"
            type="text"
            className="form-control custom-width"
            disabled
          />
        </div>
      </a>
      <br></br>
      <a>
        <Button className="mx-auto">Apply</Button>
      </a>
    </div>
  );
};

export default FilterBar;
