import Header from "./Header";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";

const NewPost = () => {
    const editorRef = useRef(null);
    const [apiKey, setApiKey] = useState(null); // State to store the API key
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            const title = event.target.title.value;
            const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${BACKEND_URL}/api/admin/newPost`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            })
             if(response.ok) {
                navigate('/admin');
             }
        }
       
    };

    const fetchApiKey = async () => {
        try {
            const response = await fetch('https://blog-app-7uxs.onrender.com/api/editor');
            const data = await response.json();
            setApiKey(data.apiKey); 
        } catch (err) {
            console.error('Error fetching API key:', err);
        }
    };


    useEffect(() => {
        fetchApiKey();
    }, []);

    return (
        <>
            <Header />
            <form onSubmit={handleSubmit}>
                <label>
                    Add a title:
                    <input type="text" name="title" required />
                </label>
                {apiKey ? (
                    <Editor
                        apiKey={apiKey}
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue=""
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
                    <p>Loading editor...</p> 
                )}
                <input type="submit" value="Submit" />
            </form>
        </>
    );
};

export default NewPost;
