
import "../css/Affirmation.css";
import "../css/Dropdown.css";
import { useState } from "react";
import { useEffect } from "react";
import { saveAffirmations } from "../second-firestore";
import{Lightbulb} from "lucide-react";
import { generateAffirmations } from "../gemini";
import DefaultAffirmations from "./DefaultAffirmations";

function AffirmationInput({index, affirmation, setAffirmations}){

    const [disabled, setDisabled] = useState(false);
    const [affirmationText, setAffirmationText] = useState(affirmation);
    const [showSelector, setShowSelector] = useState(false);

    const generateAffirmation = async () => {
        setDisabled(true);
        setAffirmationText("Generating...");
        const response = await generateAffirmations();
        console.log("Generated Affirmation: ", response);
        setAffirmationText(response);
        // Update the parent component's affirmations state with the new affirmation
        setAffirmations((prevAffirmations) => {
            const newAffirmations = [...prevAffirmations];
            newAffirmations[index] = response;
            return newAffirmations;
        });
        setDisabled(false);
    }

    const setAffirmationFromSelector = (selectedAffirmation) => {
        setAffirmationText(selectedAffirmation);
                setAffirmations((prevAffirmations) => {
            const newAffirmations = [...prevAffirmations];
            newAffirmations[index] = selectedAffirmation;
            return newAffirmations;
        });
    }

    useEffect(() => {
        setAffirmationText(affirmation);
    }, [affirmation]);

    return(
        <div>
            <label htmlFor={`affirmation-${index}`}><b>Positive Affirmation {index + 1}</b></label>
            <p>(100 Characters or Less)</p>
            <div className="affirmation-input-container">
                <div className="affirmation-input-inner">
                    <input type="text" id={`affirmation-${index}`} name={`affirmation-${index}`} 
                    placeholder={`Affirmation ${index + 1}`} 
                    maxlength = "100"
                    aria-label={`Positive Affirmation ${index + 1}`}
                    value={affirmationText}
                    onChange={(e) => {
                        setAffirmationText(e.target.value);
                        setAffirmations((prevAffirmations) => {
                            const newAffirmations = [...prevAffirmations];
                            newAffirmations[index] = e.target.value;
                            return newAffirmations;
                        }
                        )}}/>
                    < DefaultAffirmations hidden={!showSelector} 
                    setAffirmations={setAffirmations}
                    setShowSelector={setShowSelector}
                    setAffirmationFromSelector={setAffirmationFromSelector}/>
                    <div className="dropdown">
                        {/* <AffirmationSelector hidden={showSelector} 
                        affirmations={affirmationText} 
                        setAffirmations={setAffirmationText}/> */}

                        <button id="generate-affirmation-btn" 
                        className="dropbtn"
                        title="Generate Affirmation" 
                        disabled={disabled}>
                            <Lightbulb />
                            </button>
                        <div className="dropdown-content">
                            <a href="#"
                             onClick={() => setShowSelector(!showSelector)}>
                                Select an Affirmation🧑‍💻
                                </a>
                            <a href="#" onClick={
                                () => {
                                    generateAffirmation();
                                }
                            }>
                                Generate an Affirmation💭
                            </a>
                        </div>
                    </div>
                </div>
            </div>
                <br />
                <br />
        </div>
    )
}

function AffirmationEditing(props){
    const [user, setUser] = useState(props.user);
    const[affirmations, setAffirmations] = useState(props.affirmations);

    useEffect(() => {
        setAffirmations(props.affirmations);
        setUser(props.user);
    }, [props.affirmations, props.user]); // Runs whenever the parent passes new data

    const showAffirmations = () => {
        console.log("Affirmations:");
        console.log(affirmations);
    }

    const handleSave = async () => {
        const userId = user.uid; // Assuming user object has a uid property
        await saveAffirmations(userId, affirmations);
    }

    return(
        <div>
            <div id="affirmation-editing-container" hidden={!props.visible}>
                <div id="affirmation-editing-popup">
                    <div id="affirmation-editing">
                        <h2>Edit Affirmations</h2>
                        <h2 id="affirmation-close-button" 
                        onClick={()=> props.setVisible(false)}>X</h2>
                    </div>
                    <div id="affirmation-editing-content">
                        <div id="affirmation-editing-content-inner">
                            <h1>Your Affirmations</h1>
                            <p>Affirmations are positive statements that you tell or write to yourself
                                for self-motivation. Studies have found that affirmations boost well-being. 
                            </p>
                            <div id="affirmations-container">
                            {affirmations.map((affirmation, index) => (
                                    <AffirmationInput 
                                        index={index} 
                                        affirmation={affirmation} 
                                        setAffirmations={setAffirmations} 
                                    />
                                ))}
                            <br />
                                <button className="add-affirmation-btn" onClick={() => setAffirmations((prevAffirmations) => [...prevAffirmations, ""])}>Add Another</button>
                            <br />
                            <br />
                            <button id="submit-btn" onClick={handleSave}>Save Affirmations</button>
                                {/* <button onClick={showAffirmations}>Show Affirmations</button> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AffirmationEditing;