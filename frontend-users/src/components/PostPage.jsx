import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import '../styles/postPage.css';
import DOMPurify  from 'dompurify'; // sanitazing content
import { Editor } from "@tinymce/tinymce-react";
const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
// eslint-disable-next-line react/prop-types
const PostPage = ({ isAdmin }) => {

    const editorRef = useRef(null);

    const { id, slug } = useParams();  
    const [post, setPost] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentContent, setEditedCommentContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [loggedIn, setLoggedIn] = useState(false); 
    const [apiKey, setApiKey] = useState(null);

    const userId = localStorage.getItem('userId');

    useEffect(() => {
        
        fetchPost(id, slug);
        checkLoginStatus(); 
    }, [id, slug]);


    // GET POSTS
    const fetchPost = async (id, slug) => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}/${slug}`, {
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
                authorId: comment.authorId,
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


    // CHECK IF USER IS LOGGED IN
    const checkLoginStatus = () => {
        const token = localStorage.getItem('token');
        setLoggedIn(!!token); 
    };


    // POST A COMMENT
    const postComment = async (event) => {
        event.preventDefault();

        if (!newComment) {
            console.error('No comment submitted');
            return;
        }

        const userId = localStorage.getItem('userId');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}/${slug}`, {
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
                    authorId: data.commentData.authorId,
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
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/admin/edit/${id}`, {
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

    const fetchApiKey = async () => {
        try {
            const response = await fetch(`${VITE_BACKEND_URL}/api/editor`);
            const data = await response.json();
            setApiKey(data.apiKey); 
        } catch (err) {
            console.error('Error fetching API key:', err);
        }
    };

    const handleEditComment = (commentId, content) => {
        setEditingCommentId(commentId);
        setEditedCommentContent(content);
    };


    const saveEditedComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedCommentContent }),
            });
            console.log(response)
            if (response.ok) {
                console.log(response)
                setComments(comments.map(comment => 
                    comment.id === commentId ? { ...comment, content: editedCommentContent } : comment
                ));
                setEditingCommentId(null);
                setEditedCommentContent('');
            }
        } catch (err) {
            console.error('Error updating comment:', err);
        }
    };

    const deleteComment = async (commentId) => {
        if((window.confirm('Are you sure you want to delete this comment?'))){
             try {
                const token = localStorage.getItem('token');
                
                const response = await fetch(`${VITE_BACKEND_URL}/api/users/${id}/${commentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setComments(comments.filter(comment => comment.id !== commentId));
                }
            } catch (err) {
                console.error('Error deleting comment:', err);
            }
        }
    };

       useEffect(() => {
        fetchApiKey();
    }, []);

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
                                <Editor
                                    apiKey={apiKey}
                                    onInit={(evt, editor) => (editorRef.current = editor)}
                                    initialValue={editedContent}
                                    init={{
                                        height: 300,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar:
                                            'undo redo | formatselect | bold italic backcolor | \
                                            alignleft aligncenter alignright alignjustify | \
                                            bullist numlist outdent indent | removeformat | help'
                                    }}
                                />
                            ) : (
                                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }} /> // Sanitize before rendering
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
                                            <div className='comment-content'>
                                                <strong>{comment.author}: </strong>
                                                {editingCommentId === comment.id ? (
                                                    <input
                                                        type="text"
                                                        value={editedCommentContent}
                                                        onChange={(e) => setEditedCommentContent(e.target.value)}
                                                    />
                                                ) : (
                                                    comment.content
                                                )}
                                                <small>{new Date(comment.createdAt).toLocaleString()}</small>
                                            </div>
                                                {userId === comment.authorId && (
                                                <div className='comment-actions'>
                                                    {editingCommentId === comment.id ? (
                                                        <>
                                                            <button onClick={() => saveEditedComment(comment.id)}>Save</button>
                                                            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button onClick={() => handleEditComment(comment.id, comment.content)}>Edit</button>
                                                            <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            {isAdmin && userId !== comment.authorId && (
                                                <div className="comment-actions">
                                                    <button onClick={() => deleteComment(comment.id)}>Delete</button>
                                                </div>
                                            )}
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
                                    <button type="submit" style={{ background: "none", border: "none", cursor: "pointer" }}>
                                        <img src="/send.svg" height="30px" alt="Send" />
                                    </button>
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
