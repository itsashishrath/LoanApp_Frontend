import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const { register, login } = useAuth();
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsRegistering(true);

    const success = await register(
      formData.email,
      formData.username,
      formData.password,
      formData.password_confirm
    );

    if (!success) {
      setError('Registration failed. Please try again.');
      setIsRegistering(false);
    } else {
      const loginSuccess = await login(formData.email, formData.password);
      if (!loginSuccess) {
        setError('Login failed after registration. Please try again.');
        setIsRegistering(false);
      } else {
        setRedirectToDashboard(true);
      }
    }
  };

  if (redirectToDashboard) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>Enter your details to register for MiniLoan</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password_confirm">Confirm Password</Label>
            <Input
              id="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={(e) => setFormData((prev) => ({ ...prev, password_confirm: e.target.value }))}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isRegistering}
          >
            {isRegistering ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              'Register'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};