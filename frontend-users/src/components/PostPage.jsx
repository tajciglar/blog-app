import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/postPage.css'

const PostPage = () => {
    const { id, slug } = useParams();  
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    useEffect(() => {
        fetchPost(id, slug); 
    }, [id, slug]);

    const fetchPost = async (id, slug) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}/${slug}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,  
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
        
            const data = await response.json();
            console.log(data)
            setPost(data.post);
            setComments(data.comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                author: comment.author.name, 
                createdAt: comment.createdAt,
            })));  
        } catch (err) {
            console.error('Error fetching post:', err);
        }
    };

    const postComment = async (event) => {
        event.preventDefault();

        if(!newComment){
            console.error('No comment submitted');
        }
        const userId = localStorage.getItem('userId');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}/${slug}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'

                },
                body: JSON.stringify({ newComment, userId }),
            });

            const data = await response.json();
            if (data.success) {
                console.log(data)
                setComments([...comments, {
                    id: data.commentData.id,
                    content: data.commentData.content,
                    author: data.commentData.author.name, 
                    createdAt: data.commentData.createdAt,
                }]);   
                setNewComment(''); 
            }

        } catch (err) {
            console.error(err);
        }
    
    }

    return (
        <>
            <Header></Header>
            <div className='container'>
                <div className='post'>
                    {post ? (
                    <>
                        <div className='postTitle'>
                            <h3>{post.title}</h3>
                            
                        </div>
                        <div className='content'>
                            <p>{post.content}</p>
                        </div>
                        <div className='comments'>
                            <form onSubmit={postComment}>
                                <input type='text' id='newComment' onChange={(e) => setNewComment(e.target.value)} placeholder='Add a comment' value={newComment} required></input>
                                <button type='submit'>Submit</button>
                            </form>
                            
                                {comments && comments.length > 0 ? (
                                    <ul>
                                        {comments.map(comment => (
                                            <li key={comment.id}>
                                                <div>
                                                    <strong>{comment.author}:</strong> {comment.content}
                                                </div>
                                                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No comments available.</p>
                                )}
                        </div>
                    </>
                    ) : (
                        <p>Loading post...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default PostPage;
