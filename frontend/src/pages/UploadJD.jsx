import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UploadJD() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a JD file.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", file);

            await api.post(
                "/upload/jd",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            navigate("/upload-resume");
        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Failed to upload JD.");
        } finally {
            setLoading(false);
        }
    };

   return (
    <div>
        <Navbar />

        <div className="min-h-screen bg-slate-100 flex justify-center items-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">

                <h1 className="text-3xl font-bold text-center text-blue-600">
                    Upload Job Description
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Upload a PDF/DOCX containing the job description.
                </p>

                <form onSubmit={handleSubmit}>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">
                            Upload Job Description
                        </label>

                        {/* Hidden File Input */}
                        <input
                            id="jd-upload"
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Custom File Button */}
                        <label
                            htmlFor="jd-upload"
                            className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                        >
                            {file ? "Change File" : "Select File"}
                        </label>

                        {/* Selected File Name */}
                        <p className="text-sm text-gray-500 mt-3">
                            {file ? file.name : "No file selected"}
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg text-white font-medium transition ${
                            loading
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >
                        {loading ? "Uploading..." : "Upload JD"}
                    </button>

                </form>

            </div>
        </div>
    </div>
);
}

export default UploadJD;