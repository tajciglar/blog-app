import Header from "./Header";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import '../styles/newPostForm.css';

const NewPost = () => {
    const editorRef = useRef(null);
    const [apiKey, setApiKey] = useState(null);
    const navigate = useNavigate();
    const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (editorRef.current) {
            const content = editorRef.current.getContent();
            const title = event.target.title.value;

            const response = await fetch(`${VITE_BACKEND_URL}/api/admin/newPost`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, content }),
            });

            if (response.ok) {
                navigate("/admin");
            }
        }
    };

    const fetchApiKey = async () => {
        try {
            const response = await fetch(`${VITE_BACKEND_URL}/api/editor`);
            const data = await response.json();
            setApiKey(data.apiKey);
        } catch (err) {
            console.error("Error fetching API key:", err);
        }
    };

    useEffect(() => {
        fetchApiKey();
    }, []);

    return (
        <>
            <Header />
            <div className="new-post-form">
                <form onSubmit={handleSubmit}>
                <label>
                    <p>
                        Add a title:
                    </p>
       
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
            </div>
        </>
    );
};

export default NewPost;
