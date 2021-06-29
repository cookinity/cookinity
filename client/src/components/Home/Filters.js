//ToDo: Add label to the left side of the filters
//ToDo: Add search icon button to search with filters --> Collect filter and only if the user presses search apply filter
//ToDo: Make it possible to clear a filter

import React from 'react';
import './Home.scss';

const Filters = ({ options, prompt, fun, name }) => {
  return (
    <form>
      <div className="form-group row">
        <label htmlFor="select-criteria" className="col-sm-2 col-form-label">
          {name}
        </label>
        <div className="col-sm-10">
          <select 
            data-icon="fa-heart"
            className="form-control selectpicker"
            onChange={fun}
            data-live-search="true"
            data-live-search-style="startsWith"
            id="select-criteria"
          >
            <option disabled selected>
              {prompt}
            </option>
            for (let i of options)
            {options.map((i) => (
              <option>{i}</option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
};

export default Filters;
