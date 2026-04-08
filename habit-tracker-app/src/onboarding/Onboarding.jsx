import { useState, useEffect, use } from "react";
import OnboardingPopup from "./OnboardingPopup.jsx";
// import "../App.css";


function Onboarding({hidden, user, setAlreadyOnboarded}) {
    const [showPopup, setShowPopup] = useState(hidden);
    // const [showPopup, setShowPopup] = useState(false);
    // console.log("props: ", props);
    useEffect(() => {
        // Check if the user has already been onboarded
        setShowPopup(hidden);
    }, [hidden]);

    return(
        <div>
            <OnboardingPopup hidden={hidden} 
            user={user} setAlreadyOnboarded={setAlreadyOnboarded}/>
        </div>
    )
}

export default Onboarding;