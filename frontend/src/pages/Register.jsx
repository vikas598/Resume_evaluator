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
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input 
                    value={mail}
                    onChange={(e) => setMail(e.target.value)}
                    type="email"
                     />
                </div>

                <div>
                    <label>Password</label>
                    <input
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label>Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="">Select Role</option>
                        <option value="student">Student</option>
                        <option value="hr">HR</option>
                    </select>
                </div>

                <button type="submit">
                    Register
                </button>
            </form>
        
        </div>
    );
}

export default Register;