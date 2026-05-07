import { useState, useEffect } from "react";
import "../css/default-affirmations.css";
import { Plus, ChevronLeft } from "lucide-react";

// This will contain the default affirmations that the user can choose to add to 
// their list of affirmations.
// function AffirmationSelector({affirmations, setAffirmations}){
//     const defaultAffirmations = [
//         "I am capable of achieving my goals.",
//         "I am worthy of success and happiness.",
//         "I am in control of my habits and choices.",
//         "I am making progress every day.",
//         "I am resilient and can overcome challenges."
//     ];
// }


function DefaultAffirmations({hidden,setAffirmations, 
    setShowSelector, setAffirmationFromSelector}){
    const[hidePopup, setHidePopup] = useState(hidden);
    // All of the default affirmations that the user can choose from to add to 
    // their list of affirmations.
        const defaultAffirmations = [
        "I am capable of achieving my goals.",
        "I am worthy of success and happiness.",
        "I am in control of my habits and choices.",
        "I am making progress every day.",
        "I am resilient and can overcome challenges.",
        "I am committed to my personal growth and development.",
        "I am surrounded by supportive and positive people.",
        "I am grateful for the opportunities to improve myself.",
        "I am confident in my ability to create positive change in my life."
    ];

    useEffect(() => {
        setHidePopup(hidden);
        console.log("Hidden state in DefaultAffirmations:", hidePopup);
    }, [hidden]);

    return(
        <div>
            <div className="default-affirmation-container" 
            hidden={hidePopup}>
                <div
            id="back-button-default-affirmation"
            onClick={() => {
                setShowSelector(false);
            }}
          ><ChevronLeft size={48} /></div>
                <div className="default-affirmation-popup">
                    <h2>Default Affirmations</h2>
                    <p>Choose from these default affirmations to add to your list:</p>
                    <div className="default-affirmation-list-container">
                        <div className="default-affirmation-list">
                            {defaultAffirmations.map((affirmation, index) => (
                                <div className="default-affirmation-item" key={index}>
                                    <div className="default-affirmation-item-inner">
                                        <div className="default-affirmation-text">
                                            {affirmation}
                                        </div>
                                        
                                        <div>
                                            <button className="default-affirmation-btn" 
                                            onClick={() => {
                                                // setAffirmations((prevAffirmations) => [...prevAffirmations, affirmation]);
                                                setShowSelector(false);
                                                setAffirmationFromSelector(affirmation);
                                            }}>
                                                <Plus size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

}

export default DefaultAffirmations;