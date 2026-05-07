
import "../css/Affirmation.css";
import "../css/Dropdown.css";
import { useState } from "react";
import { useEffect } from "react";
import { saveAffirmations } from "../second-firestore";
import{Lightbulb, Minus} from "lucide-react";
import { generateAffirmations } from "../gemini";
import DefaultAffirmations from "./DefaultAffirmations";

function AffirmationInput({index, affirmation, setAffirmations, remove}){

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
                    <button className="affirmation-input-remove-btn" title="Remove Affirmation"
                    onClick={() => remove(index)}><Minus color="#ff0000" /></button>
                    <div className="affirmation-input-creation">
                        <input type="text" id={`affirmation-${index}`} 
                        name={`affirmation-${index}`} 
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

                            <button
                            className="dropbtn generate-affirmation-btn"
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

    const removeAffirmation = (index) => {
        setAffirmations((prevAffirmations) => {
            const newAffirmations = [...prevAffirmations];
            newAffirmations.splice(index, 1);
            return newAffirmations;
        });
    }

    const handleSave = async () => {
        const userId = user.uid; // Assuming user object has a uid property
        // Filter out strings that are empty or only whitespace
        const filteredAffirmations = affirmations.filter(
            (text) => text && text.trim().length > 0
        );

        // Save only the non-empty affirmations
        await saveAffirmations(userId, filteredAffirmations);
        
        // Optional: Refresh the local state to reflect the filtered list
        setAffirmations(filteredAffirmations);
    }

    return(
        <div>
            <div id="affirmation-editing-container" style={{ display: props.visible ? "block" : "none" }}>
                <div id="affirmation-editing-popup">
                    <div id="affirmation-editing">
                        <h2>Edit Affirmations</h2>
                        <h2 id="affirmation-close-button" 
                        onClick={()=> props.setVisible(false)}>X</h2>
                    </div>
                    <div id="affirmation-editing-content">
                        <div id="affirmation-editing-content-inner">
                            <h1>Your Affirmations</h1>
                            <p style={{fontSize: "18px"}}>
                                Affirmations are positive statements that you tell or write to yourself
                                for self-motivation. Studies have found that affirmations boost well-being. 
                            </p>
                            <div id="affirmations-container">
                            {affirmations.map((affirmation, index) => (
                                    <AffirmationInput 
                                        index={index} 
                                        affirmation={affirmation} 
                                        setAffirmations={setAffirmations}
                                        remove={removeAffirmation} 
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