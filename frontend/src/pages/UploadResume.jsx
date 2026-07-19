import { useState} from "react";

import api from "../services/api";

function UploadResume() {
    cosnt[file, setFile ] = useState(null);
    const handleFileChange = (e) =>{
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        console.log(selectedFile);
    };
    const handelSubmit= async (e)=> {
        e.preventDefault();

        if(!file){
            alert("Please select a resume");
            return;
        }

        try{
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("files", files);

            response = await api.post("/upload/resume",
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }catch(error){
            console.log(error.response.data)
        }
    }

    return (
        <h1>UploadResume Page</h1>
    );
}

export default UploadResume;