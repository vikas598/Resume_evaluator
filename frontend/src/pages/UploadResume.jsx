import { useState } from "react";
import {useNavigate} from "react-router-dom";

import api from "../services/api";

function UploadResume() {
    const [files, setFiles] = useState([]);

    const navigate= useNavigate()
    const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    console.log(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            alert("Please select at least one resume.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            files.forEach((file) => {
                formData.append("files", file);
            });

            const response = await api.post(
                "/upload/resume",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            localStorage.setItem('results', JSON.stringify(response.data))
            navigate('/result');
            console.log(response.data);
            alert("Resume uploaded successfully!");
        } catch (error) {
            console.log(error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h1>Upload Resume Page</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Upload Resume</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                    />
                </div>

                <br />

                <button type="submit">
                    Upload Resume
                </button>
            </form>
        </div>
    );
}

export default UploadResume;