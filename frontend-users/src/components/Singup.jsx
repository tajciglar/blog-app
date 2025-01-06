import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/signUp.css';


const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/api/users/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        console.log(response)
        const data = await response.json();
        if (data.success !== true) {
          console.error('Something went wrong, please try again');
        } else {
          // Navigate to the login page on successful sign-up
          navigate('/login');
        }

      } catch (error) {
        console.error('Submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm_password">Confirm Password</label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
          />
          {errors.confirm_password && <p className="error">{errors.confirm_password}</p>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>
      <p>Already signed up? Log in <a href='/login'>here</a></p>
    </div>
  );
};

export default Signup;