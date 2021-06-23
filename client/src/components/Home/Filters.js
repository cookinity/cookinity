//ToDo: Add label to the left side of the filters
//ToDo: Add search icon button to search with filters --> Collect filter and only if the user presses search apply filter
//ToDo: Make it possible to clear a filter

import React from 'react';

const Filters = ({ options, prompt, fun }) => {
  return (
    <div>
      <select
        className="form-control selectpicker"
        onChange={fun}
        id="select-criteria"
        data-live-search="true"
      >
        <option value="" disabled>
          {prompt}
        </option>
        for (let i of options){' '}
        {options.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
    </div>
  );
};

export default Filters;
