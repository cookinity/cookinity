import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import requireAuth from '../../higherOrderComponents/requireAuth';

const BookClass = () => {
  return (
    <>
      <div>Hello World</div>
    </>
  );
};

export default compose(requireAuth)(BookClass);
