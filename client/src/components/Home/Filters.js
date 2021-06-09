import React from 'react';

const Filters = () => {
    return (
    <div className="dropdown">
        <button className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Category
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a className="dropdown-item" href="#">European</a>
            <a className="dropdown-item" href="#">Asian</a>
            <a className="dropdown-item" href="#">Indian</a>
            <a className="dropdown-item" href="#">German</a>
            <a className="dropdown-item" href="#">Chinese</a>
        </div>
    </div>
    );
}

export default Filters



