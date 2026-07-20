import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("results");

        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

                <h1 className="text-2xl font-bold text-blue-600">
                    Resume Evaluator
                </h1>

                <div className="flex gap-6 items-center">

                    <Link
                        to="/upload-jd"
                        className="hover:text-blue-600"
                    >
                        Upload JD
                    </Link>

                    <Link
                        to="/upload-resume"
                        className="hover:text-blue-600"
                    >
                        Upload Resume
                    </Link>

                    <Link
                        to="/result"
                        className="hover:text-blue-600"
                    >
                        Results
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;