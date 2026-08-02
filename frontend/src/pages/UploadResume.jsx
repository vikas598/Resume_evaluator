import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import Layout from "../components/Layout";

function UploadResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a resume.");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const threadId = localStorage.getItem("thread_id");

      const formData = new FormData();
      formData.append("thread_id", threadId);
      formData.append("file", file);

      const response = await api.post("/upload/resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("result", JSON.stringify(response.data));
      localStorage.removeItem("results");
      navigate("/result");
    } catch (error) {
      console.log(error.response?.data || error.message);
      alert("Failed to upload resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="min-h-screen bg-paper flex justify-center items-center pt-20">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center text-evaluate">
            Upload Resume
          </h1>

          <p className="text-center text-gray-500 mt-2 mb-8">
            Upload your resume in PDF or DOCX format.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Upload Resume
              </label>

              {/* Hidden File Input */}
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Custom Button */}
              <label
                htmlFor="resume-upload"
                className="inline-block cursor-pointer bg-evaluate hover:bg-evaluate text-white px-5 py-2 rounded-lg transition"
              >
                {file ? "Change File" : "Select Resume"}
              </label>

              <div className="mt-4">
                {file ? (
                  <p className="text-sm text-gray-600">{file.name}</p>
                ) : (
                  <p className="text-sm text-gray-500">No file selected</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-medium transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-evaluate hover:bg-evaluate"
              }`}
            >
              {loading ? "Evaluating..." : "Evaluate Resume"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UploadResume;