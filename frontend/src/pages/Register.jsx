import { useState } from "react";

import api from "../services/api";

function Register() {
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
    } catch (error) {
    console.log(error);
}

};
    return (
        <div className="min-h-screen bg-zinc-100 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-blue-600">Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Name</label>
                    <input
                        type="text"
                        value={name}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                         Email</label>
                    <input 
                    value={mail}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setMail(e.target.value)}
                    type="email"
                     />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Password</label>
                    <input
                    type="password" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
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
        
            </div>
            
        </div>
    );
}

export default Register;