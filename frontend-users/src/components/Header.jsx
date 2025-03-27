import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/header.css'; 
import { jwtDecode } from 'jwt-decode';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation(); // Get current route

    let role = '';
    let loggedIn = false;

    const handleLogout = async () => {
        try {
            await fetch('/api/users/log-out', { method: 'GET' });
            localStorage.removeItem('token');
            navigate('/login'); 
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    const handleLogin = () => {
        navigate('/login');
    }

    const token = localStorage.getItem('token');
    
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            role = decodedToken.role;
            loggedIn = true;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    } 
    
    return (
        <header className="header">
            <h1 className="title"><a href='/'>My Blog App</a></h1>
            <nav className="nav">
                <ul className="nav-list">
                    {loggedIn ? (
                        <li className="nav-item">
                            {/* Hide "Admin" button if the current route starts with "/admin" */}
                            {role === 'ADMIN' && !location.pathname.startsWith('/admin') && (
                                <a className='admin-button' href='/admin'>Admin</a>
                            )}
                            <a className='blog-button' href='/'>Blogs</a>
                            <button className="logout-button" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    ) : (
                    {loggedIn ? (                
                            <li className="nav-item">
                                    {role === 'ADMIN' && (
                                        <a className="blog-button" href="/admin">Admin</a>
                                    )}
                                    <a className="blog-button" href="/">Blogs</a>
                                    <button className="logout-button" onClick={handleLogout}>
                                        Logout
                                    </button>
                            </li>
                    ) : (
                        <button className="login-button" onClick={handleLogin}>
                            Log in
                        </button>
                    )}
                </ul>
            </nav>
        </header>

    );
};

export default Header;