import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/logInPage.css';

const LogInPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate('/');
        }
    }, [navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        try {
            const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${VITE_BACKEND_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                const decodedToken = jwtDecode(data.token)

                 const currentTime = Date.now() / 1000; // Convert to seconds
                if (decodedToken.exp < currentTime) {
                    setError('Your session has expired. Please log in again.');
                    return;
                }
                localStorage.setItem('userId', decodedToken.id);
                if(data.role === 'ADMIN'){
                    navigate('/admin')
                } else {
                    navigate('/');
                }
                
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError('An error occurred. Please try again.', err);
        }
    };

    return (
        <div className="landing-page">
            <h1>Welcome to the Blog</h1>
            <form onSubmit={handleLogin} className='login-form'>
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
           <p>Not yet signed up? Sign up <a href='/signup'>here</a></p>
        </div>
    );
};

export default LogInPage;