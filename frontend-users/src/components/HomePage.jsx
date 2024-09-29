import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/homePage.css'

const HomePage = () => {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                  
                    localStorage.removeItem('token');
                    navigate('/login');
                    return;
                }
            } catch (err) {
                console.error('Invalid token:', err);
                localStorage.removeItem('token');
                navigate('/login');
                return;
            } finally {
                setLoading(false); 
            }

            try {
                const response = await fetch('/api/users/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login');
                    } else {
                        console.error('Error fetching profile:', response.statusText);
                    }
                    return;
                }

                const data = await response.json();
                setUser(data.user);
                setPosts(data.posts || []);

            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, [navigate]);

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    const handlePostClick = (post) => {
        const slug = generateSlug(post.title);
        navigate(`/${post.id}/${slug}`); 
    }

    return (
        <>
            <Header />
            <h1>Welcome back, {user.name}</h1>
            <div className="posts-container">
                {loading ? ( 
                    <p>Loading...</p>
                ) : ( 
                    posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div key={post.id} onClick={() => handlePostClick(post)} style={{ cursor: 'pointer' }} className={`post-card ${index % 2 === 0 ? 'post-card-top' : 'post-card-bottom'}`}>
                                <h2>{post.title}</h2>
                                <img src="/"></img>
                            </div>
                        ))
                    ) : (
                        <p>No posts available.</p>  
                    )
                )}
            </div>
        </>
    );
};

export default HomePage;
