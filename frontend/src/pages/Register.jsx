import { useState } from "react";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";

import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

import api from "../services/api";

function Register() {
    
   const [password, setPassword] = useState("");
    const [type, setType] = useState("password");
    const [icon, setIcon] = useState(eyeOff);

    const handleToggle = () => {
        if (type === "password") {
            setType("text");
            setIcon(eye);
        } else {
            setType("password");
            setIcon(eyeOff);
        }
    };
    const navigate = useNavigate();
    const[name, setName]= useState("");
    const[mail, setMail]= useState("");
    const[role, setRole]= useState("");
    const handleSubmit = async (e) => {
    e.preventDefault();

    try{
        const response = await api.post("/register",{
            name,
            mail,
            password
            
        });

        console.log(response.data);
        navigate('/login');
    } catch (error) {
    console.log(error);
}

};
    return (
        <div className="min-h-screen bg-paper flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h1 className="text-3xl font-bold text-center text-evaluate">Resume Evaluator</h1>
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
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-evaluate"
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                    />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-2">
                         Email</label>
                    <input 
                    value={mail}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-evaluate"
                    onChange={(e) => setMail(e.target.value)}
                    type="email"
                    placeholder="Enter your email"
                     />
                </div>

                <div className="mb-2">
                    <label className="block text-sm font-medium mb-2">
                        Password
                    </label>

                    <div className="relative">
                        <input
                            type={type}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            onClick={handleToggle}
                            className="absolute inset-y-0 right-3 flex items-center"
                        >
                            <Icon icon={icon} size={20} />
                        </button>
                    </div>
                </div>

                
                <button type="submit"  className="w-full bg-evaluate hover:bg-evaluate text-white py-2 rounded-lg transition">
                    Register
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?
            </p>

            <p className="text-center">
                <Link
                    to="/login"
                    className="text-evaluate hover:underline"
                >
                    Login
                </Link>
            </p>

            </div>
            
            
        </div>
    );
}

export default Register;