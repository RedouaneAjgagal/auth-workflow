import React from 'react';
import { Navigate } from 'react-router-dom';
// import { useUserContext } from '../context/user_context'
import { useGlobalContext } from '../context';

const PrivateRoute = ({ dashboard }) => {
  const { user } = useGlobalContext();
  return (
    user ? dashboard : <Navigate replace to="/" />
  );
};
export default PrivateRoute;
