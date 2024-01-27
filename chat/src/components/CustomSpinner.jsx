import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

const CustomSpinner = () => (
  <div className="container">
    <div className="d-flex justify-content-center m-5">
      <Spinner variant="success" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  </div>
);

export default CustomSpinner;
