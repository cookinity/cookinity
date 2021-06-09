import React from 'react';
import 'bootstrap/dist/js/bootstrap.bundle';

const Filters = () => {

    const toggleFunction = () => {
        document.getElementById("dropdownMenu").classList.toggle("show");
    }
      
    const showContent = () => {
        var input = document.getElementById("searchInput");
        var filter = input.value;
        var div = document.getElementById("dropdownMenu");
        var a = div.getElementsByTagName("a");
        var i;
        var txtValue;
        for (i = 0; i < a.length; i++) {
            txtValue = a[i].textContent || a[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "";
            } else {
                a[i].style.display = "none";
    }
  }
}

    return (
            <div className="dropdown">
                <button onClick = {showContent} className="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Category
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" id="dropdownMenu">
                    <input onKeyUp= {toggleFunction} type="text" placeholder="Search.." id="searchInput" ></input>
                    <a className="dropdown-item" href="#european">European</a>
                    <a className="dropdown-item" href="#asian">Asian</a>
                    <a className="dropdown-item" href="#indian">Indian</a>
                    <a className="dropdown-item" href="#german">German</a>
                    <a className="dropdown-item" href="#chinese">Chinese</a>
                </div>
            </div>
    );
}

export default Filters



