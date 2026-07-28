import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaComments,
  FaFileAlt,
  FaFileInvoice,
  FaFileUpload,
  FaRobot,
} from "react-icons/fa";

function Home() {
  const navigate = useNavigate();

  const steps = [
    { label: "Upload JD", icon: <FaFileAlt />, number: 1 },
    { label: "Upload Resume", icon: <FaFileUpload />, number: 2 },
    { label: "Get Results", icon: <FaFileInvoice />, number: 3 },
    { label: "Chat with AI", icon: <FaComments />, number: 4 },
  ];

  const features = [
    { label: "AI Analysis", icon: <FaRobot /> },
    { label: "ATS Score", icon: <FaFileAlt /> },
    { label: "Resume Feedback", icon: <FaFileInvoice /> },
    { label: "AI Chat", icon: <FaComments /> },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(31,92,85,0.08),_transparent_35%),linear-gradient(135deg,_#f3f2ed_0%,_#f7f6f2_100%)] flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl rounded-[32px] border border-gray-200/80 bg-white p-8 shadow-[0_20px_60px_-20px_rgba(27,35,31,0.25)] sm:p-10 lg:p-14">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-evaluate/10 text-4xl text-evaluate shadow-sm sm:h-20 sm:w-20 sm:text-5xl">
            <FaFileAlt />
          </div>

          <h1 className="mt-8 text-4xl font-bold tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Resume Evaluator
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 sm:text-xl">
            AI-powered resume evaluation against any Job Description.
          </p>

          <div className="mt-12 rounded-3xl border border-gray-200 bg-gray-50/80 p-5 sm:p-7">
            <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-3">
              {/* connecting line, desktop only */}
              <div className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gray-300 sm:block" />

              {steps.map((step) => (
                <div
                  key={step.label}
                  className="relative flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-4 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-evaluate text-sm font-semibold text-white ring-4 ring-white">
                    {step.number}
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg text-evaluate">{step.icon}</span>
                    <span className="text-center text-sm font-medium leading-snug text-ink">
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm"
              >
                <span className="text-evaluate">{feature.icon}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl bg-evaluate px-7 py-3.5 text-base font-semibold text-white shadow-sm transition hover:translate-y-[-1px] hover:opacity-90"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="rounded-xl border border-evaluate px-7 py-3.5 text-base font-semibold text-evaluate transition hover:bg-evaluate hover:text-white"
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;