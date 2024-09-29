import { useNavigate } from 'react-router-dom';
import '../styles/header.css'; 

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await fetch('/api/users/log-out', { method: 'GET' });
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err) {
            console.error('Error logging out:', err);
        }
    };

    return (
        <header className="header">
            <h1 className="title">My Blog App</h1>
            <nav className="nav">
                <ul className="nav-list">
                    <li className="nav-item">
                        <a className='blog-button' href='/'>Blogs</a>
                        <button className="logout-button" onClick={handleLogout}>
                            Logout
                        </button>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
