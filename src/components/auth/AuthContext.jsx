import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => {
    const savedTokens = localStorage.getItem('tokens');
    return savedTokens ? JSON.parse(savedTokens) : null;
  });

  useEffect(() => {
    if (tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
      fetchUserProfile(tokens.access); // Fetch user profile when tokens are set
    } else {
      localStorage.removeItem('tokens');
    }
  }, [tokens]);

  const login = async (email, password) => {
    try {
      const response = await fetch('http://54.252.194.42:8000/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) throw new Error('Login failed');
      console.log(response);
      
      const data = await response.json();
      setTokens(data);
      await fetchUserProfile(data.access); // Fetch user profile immediately after login
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch('http://54.252.194.42:8000/auth/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) throw new Error('Failed to fetch profile');
  
      const data = await response.json();
      console.log('Profile data:', data); // Check the profile data here
  
      // Map `is_staff` to `is_admin`
      setUser({ ...data, is_admin: data.is_staff });
    } catch (error) {
      console.error('Profile fetch error:', error);
    }
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('tokens');
  };

  // Register API
  const register = async (email, username, password, password_confirm) => {
    try {
      const body = JSON.stringify({ email, username, password, password_confirm });
      console.log('Registering with body:', body);  // Log the request body
  
      const response = await fetch('http://54.252.194.42:8000/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
      });
  
      console.log('API response:', response);  // Log the API response
  
      if (response.ok) {
        return true;
      } else {
        const data = await response.json();
        console.error('Registration failed:', data);
        return false;
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };
  
  
  

  return (
    <AuthContext.Provider value={{ user, tokens, login, logout, fetchUserProfile, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
