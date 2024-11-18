import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext' ;
import { Navigate } from 'react-router-dom';


export const ProtectedRoute = ({ children }) => {
  const { user, tokens, refreshToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    const checkAuth = async () => {
      if (!tokens) {
        return <Navigate to="/" replace />; 
      }
  
      // If tokens exist, check expiration or refresh if needed
      try {
        const tokenData = JSON.parse(atob(tokens.access.split('.')[1]));
        const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
  
        if (Date.now() >= expirationTime) {
          const refreshSuccess = await refreshToken();
          if (!refreshSuccess) {
            return <Navigate to="/" replace />;
          }
        }
      } catch (error) {
        console.error('Token validation error:', error);
        return <Navigate to="/" replace />;
      }
  
      setIsLoading(false); // Set loading to false once checks are done
    };
  
    checkAuth();
  }, [tokens, refreshToken]); // Dependencies list
  

  if (isLoading) {
    return <div>loading...</div>;
  }

  return children;
};
