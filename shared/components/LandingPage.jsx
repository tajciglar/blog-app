import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
        setError('Email and password are required.');
        return;
        }

        try {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Redirect based on user role
            if (data.role === 'admin') {
            window.location.href = '/admin';
            } else {
            window.location.href = '/users';
            }
        } else {
            setError(data.message || 'Login failed');
        }
        } catch (err) {
        setError('An error occurred. Please try again.');
        }
  };

  const handleSignUp = () => {
    navigate('/signup')
  }

  return (
    <div className="landing-page">
      <h1>Welcome to the Blog</h1>
      <form onSubmit={handleLogin}>
        {error && <p className="error">{error}</p>}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleSignUp}>Create account</button>
    </div>
  );
};

export default LandingPage;
