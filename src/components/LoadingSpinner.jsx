import React from 'react';
import { Spinner } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    // Replaced inline vh styling with Bootstrap's built-in utility class
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner animation="border" variant="light" role="status">
        {/* Visually hidden screen-reader text for clean accessibility compliance */}
        <span className="visually-hidden">Loading system data...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;