import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header';
import '../styles/postPage.css';

// eslint-disable-next-line react/prop-types
const PostPage = ({ isAdmin }) => {
    const { id, slug } = useParams();  
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 

    useEffect(() => {
        fetchPost(id, slug);
        checkLoginStatus(); 
    }, [id, slug]);

    const fetchPost = async (id, slug) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`/api/users/${id}/${slug}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',  // Token only if available
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            setPost(data.post);
            setComments(data.comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                author: comment.author.name, 
                createdAt: comment.createdAt,
            })));  

            // Set initial values for editing
            setEditedTitle(data.post.title);
            setEditedContent(data.post.content);
        } catch (err) {
            console.error('Error fetching post:', err);
        }
    };

    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        setLoggedIn(!!token); 
    };

    const postComment = async (event) => {
        event.preventDefault();

        if (!newComment) {
            console.error('No comment submitted');
            return;
        }
        const userId = localStorage.getItem('userId');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/users/${id}/${slug}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newComment, userId }),
            });

            if (response.ok) {
                const data = await response.json();
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
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/admin/edit/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: editedTitle, content: editedContent }),
            });

            if (response.ok) {
                setPost({ ...post, title: editedTitle, content: editedContent });
                setIsEditing(false);
            } else {
                console.error('Error saving post:', response.statusText);
            }
        } catch (err) {
            console.error('Error during saving post:', err);
        }
    };

    return (
        <>
            <Header />
            <div className="container">
                <div className="post">
                    {post ? (
                    <>
                        <div className="postTitle">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={editedTitle} 
                                    onChange={(e) => setEditedTitle(e.target.value)} 
                                />
                            ) : (
                                <h3>{post.title}</h3>
                            )}
                        </div>
                        <div className="content">
                            {isEditing ? (
                                <textarea 
                                    value={editedContent} 
                                    onChange={(e) => setEditedContent(e.target.value)}
                                />
                            ) : (
                                <p>{post.content}</p>
                            )}
                        </div>
                        
                        {isAdmin && (
                            <div className="admin-actions">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave}>Save</button>
                                        <button onClick={toggleEdit}>Cancel</button>
                                    </>
                                ) : (
                                    <button onClick={toggleEdit}>Edit</button>
                                )}
                            </div>
                        )}

                        <div className="comments">
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

                            {/* Only show comment form if the user is logged in */}
                            {loggedIn ? (
                                <form onSubmit={postComment} className="comment-form">
                                    <input 
                                        type="text" 
                                        id="newComment" 
                                        onChange={(e) => setNewComment(e.target.value)} 
                                        placeholder="Add a comment" 
                                        value={newComment} 
                                        required 
                                    />
                                    <button type="submit">Submit</button>
                                </form>
                            ) : (
                                <p>Please log in to leave a comment.</p>
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
