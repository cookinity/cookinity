import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';

const Filters = () => {

      return (           
            <div>
            <select className="form-control selectpicker" id="select-country" data-live-search="true">
                <option value="" disabled selected>Choose category</option>
                <option value="1">European</option>
                <option value="2">Asian</option>
                <option value="3">Indian</option>
                <option value="3">German</option>
                <option value="3">Chinese</option>
            </select>
            </div>
    );
}

export default Filters

