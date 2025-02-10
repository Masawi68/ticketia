import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, isLoggedIn, ...rest }) => {
  return isLoggedIn ? element : <Navigate to="/" />;
};

export default PrivateRoute;
