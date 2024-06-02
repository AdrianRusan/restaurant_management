import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth(Component) {
  return function WrappedComponent(props) {
    const token = localStorage.getItem('token');

    if (!token) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} />;
  };
}