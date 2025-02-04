import React from 'react';
import { Route, Navigate } from 'react-router-dom';

// PrivateRoute component for v6
const PrivateRoute = ({ element, isLoggedIn, ...rest }) => {
  return isLoggedIn ? element : <Navigate to="/" />;
};

export default PrivateRoute;
