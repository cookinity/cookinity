import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardsOverview from './CardsOverview';

export default function Parent() {
  const [classes, getClasses] = useState([]);

  useEffect(() => {
    getAllClasses();
  }, []);

  const getAllClasses = () => {
    // please change to async / await
    axios
      .get('/api/classes')
      .then((response) => {
        const allClasses = response.data;
        getClasses(allClasses);
      })
      .catch((error) => console.error('Error: ${error}'));
  };

  return <CardsOverview classes={classes} />;
}
