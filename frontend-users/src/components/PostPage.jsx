import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/postPage.css'

const PostPage = () => {
    const { id, slug } = useParams();  
    const [post, setPost] = useState(null);
    useEffect(() => {
        fetchPost(id, slug); 
    }, [id, slug]);

    const fetchPost = async (id, slug) => {
        try {
            const response = await fetch(`/api/users/${id}/${slug}`);
            const data = await response.json();
            setPost(data);
        } catch (err) {
            console.error('Error fetching post:', err);
        }
    };

    return (
        <>
            <Header></Header>
            <div className='post'>
                {post ? (
                    <>
                        <h1>{post.title}</h1>
                        <p>{post.content}</p>
                    </>
                ) : (
                    <p>Loading post...</p>
                )}
            </div>
        </>
    );
};

export default PostPage;
