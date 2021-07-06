import React from 'react';
import './Home.scss';

const Filters = ({ options, prompt, fun }) => {
  return (
    <form>
      <div className="form-group row">
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
