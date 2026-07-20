import { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";

import api from "../services/api";

function Register() {
    const navigate = useNavigate();
    const[name, setName]= useState("");
    const[mail, setMail]= useState("");
    const[password, setPassword]= useState("");
    const[role, setRole]= useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await api.post("/register",{
            name,
            mail,
            password,
            role    
        });

        console.log(response.data);
        navigate('/login');
    } catch (error) {
    console.log(error);
}

};
    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600">Resume Evaluator</h1>
                <p className="text-center text-gray-500 mt-2 mb-8">
                    Create your account
                </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <label className="block text-sm font-medium mb-2">
                        Name</label>
                    <input
                        type="text"
                        value={name}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-2">
                         Email</label>
                    <input 
                    value={mail}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setMail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                     />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-2">
                        Password</label>
                    <input
                    type="password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Role</option>
                        <option value="candidate">Candidate</option>
                        <option value="hr">HR</option>
                    </select>
                </div>

                <button type="submit"  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
                    Register
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?
            </p>

            <p className="text-center">
                <Link
                    to="/login"
                    className="text-blue-600 hover:underline"
                >
                    Login
                </Link>
            </p>

            </div>
            
            
        </div>
    );
}

export default Register;