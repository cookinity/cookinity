import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout/Layout'
import { compose } from 'redux';
import requireAuth from 'higherOrderComponents/requireAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router-dom';


const BookedClasses = () => {
    return (
        <Layout>
            <h1>test</h1>
        </Layout>
    )

}

export default compose(requireAuth)(BookedClasses);