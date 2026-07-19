import {useState} from "react";
import {useNavigate} from "react-router-dom";

import api from "../services/api";

function Login() {
    const navigate = useNavigate();
    const[mail, setMail]=useState("")
    const[password, setPassword]= useState("")
    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const formData = new URLSearchParams();

            formData.append("username", mail);
            formData.append("password", password);

            const response = await api.post("/login", formData);

            localStorage.setItem("token", response.data.access_token);
            navigate('/upload-jd');
        }
        catch(error){
            console.log(error.response.data);
        }
    }
    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600">
                        Resume Evaluator
                    </h1>

                    <p className="text-center text-gray-500 mt-2 mb-8">
                        AI-Powered Resume Screening
                    </p>
                 <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-2">
                         Email
                    </label>
                    <input 
                    value={mail}
                    onChange={(e)=> setMail(e.target.value)}
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input  
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type="Password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                    Login
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Don't have an account?
            </p>

            <p className="text-center">
                <a
                    href="/register"
                    className="text-blue-600 hover:underline"
                >
                    Register
                </a>
            </p>
            </div>
        </div>
    );
}

export default Login;