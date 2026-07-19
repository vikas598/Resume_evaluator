import {useState} from "react";

import api from "../services/api";

function Login() {
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
            // console.log(localStorage.getItem("token"));

            // console.log(response.data);
        }
        catch(error){
            console.log(error.response.data);
        }
    }
    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mail</label>
                    <input 
                    value={mail}
                    onChange={(e)=> setMail(e.target.value)}
                    type="email" 
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input  
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    type="Password"
                    />
                </div>

                <div>
                    <button type="submit">
                    Login
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Login;