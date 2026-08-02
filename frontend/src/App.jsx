import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import UploadResume from "./pages/UploadResume";
import UploadJD from "./pages/UploadJD";
import Result from "./pages/Result";
import Chat from "./pages/Chat";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/upload-resume" element={<UploadResume />} />
                <Route path="/upload-jd" element={<UploadJD />} />
                <Route path="/result" element={<Result />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/chat/:thread_id" element={<Chat />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;