import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CardsOverview from './CardsOverview';

export default function Parent() {
    const [classes, getClasses] = useState('')

    const url = 'http://localhost:3000/'

    useEffect( () => {
        getAllClasses();
    }, [])

    const getAllClasses = () => {
        axios.get('${url}api/classes')
        .then((response) => {
            const allClasses = response.data.classes
            getClasses(allClasses)
        })
        .catch(error => console.error('Error: ${error}'))
    }

    return(
        <CardsOverview classes={classes} />
    )
}