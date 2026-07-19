import {useNavigate} from "react-router-dom";

function Result(){
    const navigate = useNavigate();

    const results = JSON.parse(
    localStorage.getItem("results")
    );
    return (
    <div>
        {results.map((result, index) => (
            <div key={index}>
                <h2>{result.name}</h2>
                <p>Overall Score: {result.score}%</p>
                <h3>Matching Skills</h3>
                <ul>
                    {result.detail.matching_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
                <h3>Missing Important Skill</h3>
                <ul>
                    {result.detail.missing_important_skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                    ))}
                </ul>
                <h3>Final Verdict</h3>
                <p>{result.detail.final_verdict}</p>
            </div>
        ))}
    </div>
);
}

export default Result;