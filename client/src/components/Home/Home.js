import React, { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../Layout/Layout';
import { Alert, Col, Row, Button} from 'react-bootstrap';

import { sortByDropdown } from './Utility/DataForFilters';
import ClassCard from './ClassCard';
import Filters from './Filters';
import Loader from 'components/Shared/Loader/Loader';
import { CLASS_CATEGORIES } from 'constants/ClassCategories';
import { CITY_CATEGORIES } from 'constants/CityCategories';
import DatePicker from 'react-multi-date-picker';
import { sortBy } from 'lodash';



export const Home = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [limit, setLimit] = useState(2);
  const [skip, setSkip] = useState(0);
  const [queryString, setQueryString] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [cat, setCat] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    fetchClasses(limit, skip)
  }, [skip, limit])

  const fetchClasses = async (limit, skip) => {
    setIsError(false);
    setIsLoading(true);
    try {
      const result = await axios(`/api/classes?limit=${limit}&skip=${skip}${queryString}`);
      setClasses(result.data.classes);
      setFilteredClasses(result.data.classes);
    } catch (err) {
      setIsError(true);
      setErrorMessage(err?.response?.data.message || err.message);
    }
    setIsLoading(false);
  };

  
     const nextPage = () => {
      setSkip(skip + limit)
    }

    const previousPage = () => {
      setSkip(skip - limit)
    }

  const handleFilterCategory = async (e) => {
    let value = e.target.value;
    setQueryString(queryString.concat(`&category=${value}`));
    setCat(value);
  };

  const handleFilterCity = (e) => {
    let value = e.target.value;
    setQueryString(queryString.concat(`&city=${value}`));
    setCity(value);
  };

    const handleFilterDate = (e) => {
    setQueryString(queryString.concat(`&date=${e}`));
    localStorage.setItem("date", e.target.value)
    setStartDate(e);
  }

  //Darstellung aller Kurse ohne Filter
  const classCards = filteredClasses.map((c) => {
    return (
      <Col sm={12} md={6} lg={4}>
        <ClassCard c={c} key={c.id}></ClassCard>
      </Col>
    );
  });

  //mit Filter In CardsOverview oder hier (implementierung wenn filter geht)
  // const classCardsfilter = filteredClasses.map((c) => {
  //  return (
  //    <Col sm={12} md={6} lg={4}>
  //      <ClassCard c={c} key={c.id}></ClassCard>
  //    </Col>)
  // });

  if (isLoading) {
    return (
      <Layout>
        <Loader></Loader>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div className="mt-2">
          {isError && (
            <Alert
              variant="danger"
              onClose={() => {
                setIsError(false);
                setErrorMessage('');
              }}
              dismissible
            >
              {' '}
              {errorMessage}
            </Alert>
          )}
          <Row>
            <Col>
            <form className="form-inline">
              <Filters
                options={CLASS_CATEGORIES}
                prompt="Select category"
                fun={event => handleFilterCategory(event)}
                name="Categories"
              />
              
              <Filters
                options={CITY_CATEGORIES}
                prompt="Select city"
                fun={event => handleFilterCity(event)}
                name="Cities"
              />

              <div>
              <label>Dates</label>
              <input onChange={e => { handleFilterDate(e) }} type="date"></input>
              </div>

             <Button className="mx-auto" onClick={fetchClasses}>Submit</Button>
             </form>
             <Button onClick={fetchClasses}>Show all</Button>

            </Col>
          </Row>
          <p></p>
          <Row> {classCards} </Row>
          <label htmlFor="">
      </label>
      
				
          <div>
            <Button onClick={previousPage}>Previos Page</Button>
            <Button onClick={nextPage}> Next Page</Button>
          </div>
        </div>
        </Layout>
    );
  }
};
