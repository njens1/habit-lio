import { useState, useEffect, use } from "react";

// import "../App.css";
import "../css/Onboarding.css";

import {
  saveOnboardingStatus,
  saveUserInfo,
  checkUsernameExists,
  saveProfilePicture,
} from "../firestore.js";
import { generateAffirmations } from "../gemini";
import { Lightbulb } from "lucide-react";

function Page1({ currentPage, setCurrentPage, isGoogleUser }) {
  const [pageName, setPageName] = useState("Page1");
  // console.log("current page should be 1: ", currentPage !== pageName);
  return (
    <div hidden={currentPage !== pageName}>
      <div className="onboarding-content">
        <h1>HEY! I HAVEN'T SEEN YOU BEFORE!</h1>
        <p>You must be new here.</p>
        <p>
          Welcome to habit.lio! This is an habit-tracking chrome extension that
          is designed to integrate seamlessly with your browsing experience!
        </p>
        <br />
        <p> Let’s get habit.lio personalized for you.</p>
        <button
          className="continue-btn"
          onClick={() => setCurrentPage(isGoogleUser ? "Page4" : "Page2")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Page2({ currentPage, setCurrentPage, setUserInfo, user }) {
  const [pageName, setPageName] = useState("Page2");
  const [username, setUsername] = useState(user?.displayName || "");
  const [error, setError] = useState("");
  // console.log("current page should be 2: ", currentPage !== pageName);
  const checkUsername = (username) => {
    return (
      username.length > 0 &&
      username.length <= 20 &&
      username.trim().length !== 0
    );
  };

  const usernameExists = async (username) => {
    const exists = await checkUsernameExists(username);
    if (exists) {
      setError("Username already exists.");
    } else {
      setCurrentPage("Page3");
    }
    return exists;
  };

  return (
    <div className="onboarding-wrapper" hidden={currentPage !== pageName}>
      <div className="onboarding-content">
        <h1>Who are you?</h1>
        <p>Let us know a bit about yourself to personalize your experience.</p>

        <p style={{ color: "red" }}>{error}</p>
        <label htmlFor="username" className="required">
          Create a Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          placeholder="Username"
          aria-label="Username"
          maxLength="20"
          onChange={(e) => {
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              username: e.target.value,
            }));
            setUsername(e.target.value);
          }}
        />

        <label htmlFor="greet-username">Greeting by Username?</label>
        <input
          type="checkbox"
          id="greet-username"
          name="greet-username"
          aria-label="Greeting by Username"
          checked={true}
          onChange={(e) =>
            setUserInfo((prevUserInfo) => ({
              ...prevUserInfo,
              greetUsername: e.target.checked,
            }))
          }
        />
        <br />
        <button
          className="continue-btn"
          name="Continue"
          disabled={!checkUsername(username)}
          onClick={async () => {
            usernameExists(username);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Page3({ currentPage, setCurrentPage, user }) {
  const [pageName, setPageName] = useState("Page3");
  const [profilePicture, setProfilePicture] = useState(user?.photoURL || null);
  // console.log("current page should be 3: ", currentPage !== pageName);
  // var fileInputRef = document.getElementById("profile-picture");
  // // Erase the file selected if users decide to click "upload file after uploading"
  const handleUpload = async (file) => {
    if (file) {
      const pictureUrl = await saveProfilePicture(user.uid, file);
      if (!pictureUrl) {
        console.error("Failed to save profile picture.");
        return;
      }
    }
    setCurrentPage("Page4");
  };

  return (
    <div className="onboarding-wrapper" hidden={currentPage !== pageName}>
      <div className="onboarding-content">
        <h1>Add a Profile Picture</h1>
        <p>Upload a profile picture to personalize your experience.</p>
        <p>Let the world know who you are!!</p>
        <label htmlFor="profile-picture">Upload Profile Picture</label>
        <input
          type="file"
          id="profile-picture"
          name="profile-picture"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
        />
        {profilePicture && (
          <div>
            <p>Selected Profile Picture:</p>
            <img
              width="50%"
              height="50%"
              src={
                typeof profilePicture === "string"
                  ? profilePicture
                  : URL.createObjectURL(profilePicture)
              }
              alt="Profile"
            />
          </div>
        )}
        <br />
        <button
          className="continue-btn"
          onClick={async () => {
            handleUpload(profilePicture);
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function Page4({ currentPage, setCurrentPage, setUserInfo }) {
  const [pageName, setPageName] = useState("Page4");
  const [habitGoal, setHabitGoal] = useState("build");
  // console.log("current page should be 4: ", currentPage !== pageName);
  return (
    <div className="onboarding-wrapper" hidden={currentPage !== pageName}>
      <div className="onboarding-content">
        <h1>What are you looking to do with your habits?</h1>
        <p>Tell me about your habit-tracking goals!</p>
        <div id="onboard-build-quit-btns">
          <label htmlFor="build">
            <button
              className="onboarding-build-quit"
              title="Build Habits"
              name="build"
              onClick={() => {
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  habitGoal: "build",
                }));
                setHabitGoal("build");
              }}
              style={{
                backgroundColor: habitGoal === "build" ? "#5B5FB4" : "#969696",
                color: habitGoal === "build" ? "white" : "black",
              }}
            >
              Build
            </button>
          </label>

          <label htmlFor="quit">
            <button
              className="onboarding-build-quit"
              title="Quit Habits"
              name="quit"
              onClick={() => {
                setUserInfo((prevUserInfo) => ({
                  ...prevUserInfo,
                  habitGoal: "quit",
                }));
                setHabitGoal("quit");
              }}
              style={{
                backgroundColor: habitGoal === "quit" ? "#5B5FB4" : "#969696",
                color: habitGoal === "quit" ? "white" : "black",
              }}
            >
              Quit
            </button>
          </label>
        </div>
        <h1>
          {habitGoal === "build"
            ? "Awesome! Let’s build up some habits then!"
            : "Got it! Let’s work on breaking some habits."}
        </h1>
        <button
          className="continue-btn"
          onClick={() => setCurrentPage("Page5")}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function AffirmationInput({ index, affirmation, setAffirmations }) {
  const [disabled, setDisabled] = useState(false);
  const [affirmationText, setAffirmationText] = useState(affirmation);

  const generateAffirmation = async () => {
    setDisabled(true);
    const response = await generateAffirmations();
    // console.log("Generated Affirmation: ", response);
    setAffirmationText(response);
    // Update the parent component's affirmations state with the new affirmation
    setAffirmations((prevAffirmations) => {
      const newAffirmations = [...prevAffirmations];
      newAffirmations[index] = response;
      return newAffirmations;
    });
    setDisabled(false);
  };

  useEffect(() => {
    setAffirmationText(affirmation);
  }, [affirmation]);

  return (
    <div>
      <label htmlFor={`affirmation-${index}`}>
        <b>Positive Affirmation {index + 1}</b>
      </label>
      <p>(100 Characters or Less)</p>
      <div className="affirmation-input-container-onboarding">
        <div className="affirmation-input-inner-onboarding">
          <input
            type="text"
            id={`affirmation-${index}`}
            name={`affirmation-${index}`}
            placeholder={`Affirmation ${index + 1}`}
            maxlength="100"
            aria-label={`Positive Affirmation ${index + 1}`}
            value={affirmationText}
            onChange={(e) => {
              setAffirmationText(e.target.value);
              setAffirmations((prevAffirmations) => {
                const newAffirmations = [...prevAffirmations];
                newAffirmations[index] = e.target.value;
                return newAffirmations;
              });
            }}
          />
          <button
            id="generate-affirmation-btn-onboarding"
            title="Generate Affirmation"
            disabled={disabled}
            onClick={() => {
              // Logic for generating affirmation
              generateAffirmation();
            }}
          >
            <Lightbulb />
          </button>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}

function Page5({ currentPage, setCurrentPage, setUserInfo }) {
  const [pageName, setPageName] = useState("Page5");
  const [affirmations, setAffirmations] = useState([""]);

  return (
    <div>
      <div className="onboarding-wrapper" hidden={currentPage !== pageName}>
        <div className="onboarding-content">
          <h1>List some Affirmations!</h1>
          <p>
            Affirmations are positive statements that you tell or write to
            yourself for self-motivation. Studies have found that affirmations
            boost well-being.
          </p>
          <p> TRY IT OUT!!</p>
          <p> Note: You will be able to edit these later.</p>
          <div id="affirmations-container">
            {affirmations.map((affirmation, index) => (
              <AffirmationInput
                index={index}
                affirmation={affirmation}
                setAffirmations={setAffirmations}
              />
            ))}
          </div>
          <br />
          <button
            className="add-affirmation-btn"
            onClick={() =>
              setAffirmations((prevAffirmations) => [...prevAffirmations, ""])
            }
          >
            Add Another
          </button>
          <br />
          <button
            className="continue-btn"
            onClick={() => {
              setUserInfo((prevUserInfo) => ({
                ...prevUserInfo,
                affirmations: affirmations,
              }));
              setCurrentPage("Page6");
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

function Page6({ currentPage, setCurrentPage }) {
  const [pageName, setPageName] = useState("Page6");
  return (
    <div>
      <div className="onboarding-wrapper" hidden={currentPage !== pageName}>
        <div className="onboarding-content">
          <h1>😎😎😎😎😎😎😎</h1>
          <h1>YOU ARE ALL SET!</h1>
          <p>
            Congratulations! Habit.lio is now personalized for your own personal
            habit-tracking journey.{" "}
          </p>
          <br />
          <p>
            We wish you the best of luck on your success in building and
            quitting habits. We look forward to seeing the NEW YOU🔥🔥
          </p>
          <br />
          <br />
          {/* In this button, we will handle the submission of the onboarding form */}
          <button
            className="continue-btn"
            name="Let's Go!"
            onClick={() => setCurrentPage("Page7")}
          >
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}

function OnboardingPopup(props) {
  console.log("DEBUG: OnboardingPopup received user:", props.user);
  const user = props.user;
  const isGoogleUser = user?.providerData?.[0]?.providerId === "google.com";
  const [userInfo, setUserInfo] = useState({
    username: user?.displayName || "",
    greetUsername: true,
    habitGoal: "",
    affirmations: [],
    profilePicture: user?.photoURL || "",
  });
  const [showPopup, setShowPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState("Page1");
  // console.log("props in onboarding popup: ", props);
  // console.log("props.hidden: ", props.props.hidden);
  useEffect(() => {
    if (currentPage === "Page7" && user) {
      // Here, we will handle the submission of the onboarding form and send the userInfo to the backend.
      // For now, we will just log the userInfo to the console.
      // console.log("User Info: ", userInfo);
      // console.log("User in effect: ", user);
      saveOnboardingStatus(user.uid, true);
      saveUserInfo(user.uid, userInfo);
      props.setAlreadyOnboarded(true);
      // setShowPopup(false);
    }
  }, [currentPage, userInfo, user]);

  useEffect(() => {
    if (isGoogleUser && currentPage === "Page2") {
      setCurrentPage("Page4");
    }
    if (isGoogleUser && currentPage === "Page3") {
      setCurrentPage("Page4");
    }
  }, [currentPage, isGoogleUser]);

  return (
    <div>
      <div
        id="onboarding-container"
        style={{ display: props.hidden ? "none" : "block" }}
      >
        <div id="onboarding">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div id="dots-container">
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page1"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page2"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page3"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page4"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page5"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
              <div
                className="dot"
                style={{
                  backgroundColor:
                    currentPage === "Page6"
                      ? "rgba(145, 145, 145, 1)"
                      : "rgba(145, 145, 145, 0.5)",
                }}
              ></div>
            </div>
          </div>
          <Page1
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isGoogleUser={isGoogleUser}
          />

          <Page2
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setUserInfo={setUserInfo}
            user={user}
          />

          <Page3
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            user={user}
          />

          <Page4
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setUserInfo={setUserInfo}
          />

          <Page5
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setUserInfo={setUserInfo}
          />

          <Page6 currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
      </div>
    </div>
  );
}

export default OnboardingPopup;
