import { useState, useEffect } from "react";

// import "../App.css";
import "../css/Onboarding.css";

function Page1({currentPage, setCurrentPage}){
    const [pageName, setPageName] = useState("Page1");
    console.log("current page should be 1: ", currentPage !== pageName);
    return(
        <div hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>HEY! I HAVEN'T SEEN YOU BEFORE!</h1>
            <p>You must be new here.</p>
            <p>Welcome to habit.lio! This is an 
                habit-tracking chrome extension that is designed 
                to integrate seamlessly with your browsing experience!</p>
            <br />
            <p> Let’s get habit.lio personalized for you.</p>
            <button className="continue-btn" onClick={() => setCurrentPage("Page2")} >Continue</button>
            </div>
        </div>
    )
}

function Page2({currentPage, setCurrentPage, setUserInfo}){
    const [pageName, setPageName] = useState("Page2");
    const [firstName, setFirstName] = useState("");
    console.log("current page should be 2: ", currentPage !== pageName);
    return(
        <div className="onboarding-wrapper" hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>Who are you?</h1>
            <p>Let us know a bit about yourself to personalize your experience.</p>
            <label htmlFor="first-name">First Name or Nickname (Optional)</label>
            <input type="text" id="first-name" name="first-name" 
            placeholder="First Name" aria-label="First Name" 
            onChange={(e) => {
                setUserInfo((prevUserInfo) => ({...prevUserInfo, firstName: e.target.value}));
                setFirstName(e.target.value);
            }}/>
            <label htmlFor="last-name">Last Name (Optional)</label>
            <input type="text" id="last-name" name="last-name" placeholder="Last Name" aria-label="Last Name"
            onChange={(e) => setUserInfo((prevUserInfo) => ({...prevUserInfo, lastName: e.target.value}))}/>
            <label htmlFor="username">Create a Username (Optional)</label>
            <input type="text" id="username" name="username" placeholder="Username" aria-label="Username"
            onChange={(e) => setUserInfo((prevUserInfo) => ({...prevUserInfo, username: e.target.value}))}/>
            <label htmlFor="greet-username">Greeting by Username?</label>
            <input type="checkbox" id="greet-username" 
            name="greet-username" aria-label="Greeting by Username"
            onChange={(e) => setUserInfo((prevUserInfo) => ({...prevUserInfo, greetUsername: e.target.checked}))}/>
            <button className="continue-btn"
            onClick={() => setCurrentPage("Page3")} >Continue</button>
        </div>
        </div>
    )
}

function Page3({currentPage, setCurrentPage}){
    const [pageName, setPageName] = useState("Page3");
    console.log("current page should be 3: ", currentPage !== pageName);
    // var fileInputRef = document.getElementById("profile-picture");
    // // Erase the file selected if users decide to click "upload file after uploading"


    return(
        <div className="onboarding-wrapper" hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>Add a Profile Picture (Optional)</h1>
            <p>Upload a profile picture to personalize your experience.</p>
            <p>Let the world know who you are!!</p>
            <label htmlFor="profile-picture">Upload Profile Picture</label>
            <input type="file" id="profile-picture" 
            name="profile-picture" accept="image/*"  />
            <br />
            <button className="continue-btn"
            onClick={() => setCurrentPage("Page4")} >Continue</button>
        </div>
        </div>
    )
}

function Page4({currentPage, setCurrentPage, setUserInfo}){
    const [pageName, setPageName] = useState("Page4");
    const [habitGoal, setHabitGoal] = useState("build");
    console.log("current page should be 4: ", currentPage !== pageName);
    return(
        <div className="onboarding-wrapper" hidden = {currentPage !== pageName}>
        <div className = "onboarding-content">
            <h1>What are you looking to do with your habits?</h1>
            <p>Tell me about your habit-tracking goals!</p>
            <div id="onboard-build-quit-btns">
                <label htmlFor="build"><button className="onboarding-build-quit" 
                title="Build Habits"
                name="build"
                onClick={() => {setUserInfo((prevUserInfo) => 
                    ({...prevUserInfo, habitGoal: "build"})); setHabitGoal("build")}}
                    style={{backgroundColor: habitGoal === "build" ? "#5B5FB4" : "#969696",
                    color: habitGoal === "build" ? "white" : "black"}}>Build</button></label>
            
            <label htmlFor="quit"><button className="onboarding-build-quit" 
            title="Quit Habits"
            name="quit"
                onClick={() => {setUserInfo((prevUserInfo) => 
                    ({...prevUserInfo, habitGoal: "quit"})); setHabitGoal("quit")}}
                    style={{backgroundColor: habitGoal === "quit" ? "#5B5FB4" : "#969696",
                    color: habitGoal === "quit" ? "white" : "black"}}>Quit</button></label>
            </div>
            <h1>{habitGoal === "build" ? "Awesome! Let’s build up some habits then!" : "Got it! Let’s work on breaking some habits."}</h1>
            <button className="continue-btn"
            onClick={() => setCurrentPage("Page5")} >Continue</button>
        </div>
        </div>
    )
}


function OnboardingPopup(props) {
    const [userInfo, setUserInfo] = useState({
        firstName: "",
        lastName: "",
        username: "",
        greetUsername: false,
        habitGoal: "",
    });
    const [showPopup, setShowPopup] = useState(false);
    const [currentPage, setCurrentPage] = useState("Page1");
    // console.log("props in onboarding popup: ", props);
    // console.log("props.hidden: ", props.props.hidden);

    return(
        <div>
            <div id="onboarding-container" style={
                {display: props.props.hidden ? "none" : "block"}}>
                <div id="onboarding">
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <div id="dots-container">
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page1" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page2" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page3" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page4" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page5" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                            <div className="dot" 
                            style={{backgroundColor: 
                            currentPage === "Page6" ? "rgba(145, 145, 145, 1)" 
                            : "rgba(145, 145, 145, 0.5)"}}></div>
                        </div>
                    </div>
                    < Page1 currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    setUserInfo={setUserInfo}/>

                    < Page2 currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    setUserInfo={setUserInfo} />

                    < Page3 currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} />

                    < Page4 currentPage={currentPage} 
                    setCurrentPage={setCurrentPage} 
                    setUserInfo={setUserInfo} />
                </div>
            </div>
        </div>
    );
}

export default OnboardingPopup;