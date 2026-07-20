import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";

function UploadResume() {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (files.length === 0) {
            alert("Please select at least one resume.");
            return;
        }

        try {
            setLoading(true);

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

            localStorage.setItem("results", JSON.stringify(response.data));
            navigate("/result");
        } catch (error) {
            console.log(error.response?.data || error.message);
            alert("Failed to upload resumes.");
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
                        Upload Resume(s)
                    </h1>

                    <p className="text-center text-gray-500 mt-2 mb-8">
                        Upload one or more PDF/DOCX resumes for evaluation.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-6">

                            <label className="block text-sm font-medium mb-3">
                                Upload Resume(s)
                            </label>

                            {/* Hidden File Input */}
                            <input
                                id="resume-upload"
                                type="file"
                                multiple
                                accept=".pdf,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            {/* Custom Button */}
                            <label
                                htmlFor="resume-upload"
                                className="inline-block cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition"
                            >
                                {files.length > 0
                                    ? "Change Files"
                                    : "Select Resume(s)"}
                            </label>
                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                        {files.length} file(s) selected
                                    </p>
                            {/* Selected Files */}
                            <div className="mt-4">
                                {files.length === 0 ? (
                                    <p className="text-sm text-gray-500">
                                        No files selected
                                    </p>
                                ) : (
                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                        {files.map((file, index) => (
                                            <li key={index}>
                                                {file.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

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
                            {loading
                                ? "Evaluating..."
                                : "Evaluate Resume(s)"}
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default UploadResume;