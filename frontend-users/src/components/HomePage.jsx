import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';


const HomePage = () => {

    const [user, setUser] = useState({})
    const navigate = useNavigate();
    useEffect(() => { 
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/users/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login'); 
                    } else {
                        console.error('Error fetching profile');
                    }
                }

                const data = await response.json();
                setUser(data.user);
            } catch (err) {
                console.error('Error:', err);
            }
    };
    fetchProfile();
  }, [navigate]);

    return (
        <>
            <p>Welcome back {user.name} </p>
        </>
    )
}

export default HomePage;