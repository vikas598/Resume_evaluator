import { useState } from "react";

import api from "../services/api";

function UploadJD() {
    const[file, setFile] = useState(null);
    const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log(selectedFile);
};  
    const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
        alert("Please select a JD file.");
        return;
    }

    try {
        const token = localStorage.getItem("token");

        const formData = new FormData();
        formData.append("file", file);

        response = await api.post(
            "/upload/jd",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    } catch (error) {
        console.log(error.response.data);
    }
};
    

    return (
        <div>
            <h1>UploadJD Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Upload JD</label>
                <input type="file" 
            onChange={handleFileChange}
            />
                </div>
            <div>
                <button type="submit">
                    Upload
                </button>
            </div>
            </form>
        </div>
    );
    }

export default UploadJD;