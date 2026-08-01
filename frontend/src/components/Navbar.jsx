import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        // scrolling down
        setShowNavbar(false);
      } else {
        // scrolling up
        setShowNavbar(true);
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("results");

    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-300 ${
        showNavbar ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <button
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-evaluate hover:opacity-80"
        >
          Resume Evaluator
        </button>

        <div className="flex gap-6 items-center">
          <Link to="/upload-jd" className="hover:text-evaluate">
            Upload JD
          </Link>

          <Link to="/upload-resume" className="hover:text-evaluate">
            Upload Resume
          </Link>

          <Link to="/result" className="hover:text-evaluate">
            Results
          </Link>

          <a
            href="https://github.com/vikas598/Resume_evaluator"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            <FaGithub size={20} />
            <span>GitHub</span>
          </a>

          <button
            onClick={handleLogout}
            className="bg-flag text-white px-4 py-2 rounded-lg hover:bg-flag"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
