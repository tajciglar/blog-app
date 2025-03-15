import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import PropTypes from 'prop-types';
import '../styles/homePage.css';

const HomePage = ({ isAdmin }) => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchProfileAndPosts = async () => {
            const token = localStorage.getItem('token');
            
            try {
                
                const postsResponse = await fetch(`${VITE_BACKEND_URL}/api/users`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                console.log(postsResponse)
                if (!postsResponse.ok) {
                    console.error('Error fetching posts:', postsResponse.statusText);
                    return;
                }

                const postsData = await postsResponse.json();
                setPosts(postsData.posts || []);

            } catch (err) {
                console.error('Error fetching posts:', err);
            }

            if (token) {
                try {
                    const decodedToken = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decodedToken.exp < currentTime) {
                        localStorage.removeItem('token');
                        navigate('/login');
                        return;
                    }

                    const userResponse = await fetch(`${VITE_BACKEND_URL}/api/users`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });

                    if (!userResponse.ok) {
                        if (userResponse.status === 401) {
                            navigate('/login');
                        } else {
                            console.error('Error fetching user profile:', userResponse.statusText);
                        }
                        return;
                    }

                    const userData = await userResponse.json();
                    setUser(userData.user);

                } catch (err) {
                    console.error('Error fetching user profile:', err);
                }
            }

            setLoading(false);
        };

        fetchProfileAndPosts();
    }, [navigate]);

    const generateSlug = (title) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    };

    const handlePostClick = (post) => {
        const slug = generateSlug(post.title);
        if (isAdmin) {
            navigate(`/admin/${post.id}/${slug}`);
        } else {
            navigate(`/${post.id}/${slug}`);
        }
    };

    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await fetch(`${VITE_BACKEND_URL}/api/admin/delete/${postId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (response.ok) {
                    setPosts(posts.filter(post => post.id !== postId));
                    navigate("/admin");
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleNewPost = () => {
        navigate('/admin/newPost');
    };

    return (
        <>
            <Header />
            <h1>{user ? `Welcome back, ${user.name}` : 'Welcome to Taj\'s Blog'}</h1>
            <div className="posts-container">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    posts.length > 0 ? (
                        posts.map((post) => (
                            <div 
                                key={post.id} 
                                onClick={() => handlePostClick(post)} 
                                className={`post-card`}
                            >
                                <h2>{post.title}</h2>
                                <img src="/" alt="picture placeholder " />
                                {isAdmin && (
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeletePost(post.id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No posts available.</p>  
                    )
                )}
            </div>
            {isAdmin && (
                <div className="new-post-container">
                     <button id="new-post" onClick={handleNewPost}>NEW POST</button>
                </div>
               
            )}
        </>
    );
};

HomePage.propTypes = {
    isAdmin: PropTypes.bool
};

export default HomePage;