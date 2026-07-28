import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

function Result() {
  const results = JSON.parse(localStorage.getItem("results")) || [];
  const navigate = useNavigate();
  const getScoreColor = (score) => {
    if (score >= 80) return "bg-match/10 text-match";
    if (score >= 60) return "bg-gap/10 text-gap";
    return "bg-gap/10 text-gap";
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-paper pt-28 pb-10 px-6">
        <h1 className="text-4xl font-bold text-center text-evaluate mb-10">
          Resume Evaluation Results
        </h1>

        {results.length === 0 ? (
          <p className="text-center text-gray-500">No results found.</p>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-ink">
                    {result.name}
                  </h2>

                  <span
                    className={`px-4 py-2 rounded-full font-semibold ${getScoreColor(result.score)}`}
                  >
                    {result.score}%
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-match mb-2">
                    Matching Skills
                  </h3>

                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.detail.matching_skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gap mb-2">
                    Missing Important Skills
                  </h3>

                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {result.detail.missing_important_skills.map(
                      (skill, index) => (
                        <li key={index}>{skill}</li>
                      ),
                    )}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-evaluate mb-2">
                    Final Verdict
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    {result.detail.final_verdict}
                  </p>
                  <button
                    onClick={() => navigate("/chat")}
                    className="mt-6 bg-evaluate hover:bg-evaluate text-white px-5 py-2 rounded-lg transition"
                  >
                    Chat with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Result;
