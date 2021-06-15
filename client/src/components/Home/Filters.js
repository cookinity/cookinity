import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';

const Filters = ({options, prompt, fun}) => {
    
        return (           
            <div>
            <select className="form-control selectpicker" onChange={fun} id="select-criteria" data-live-search="true">
                <option value="" disabled selected>{prompt}</option>
                for (let i of options) {
                    options.map((i) => <option >{i}</option>)
                }
                             
            </select>
            </div>
    );
}

export default Filters

