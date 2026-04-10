/*
  App.jsx is the entry point of the habit tracker, holding the global state and routing to other files
 */

import { useState, useEffect, use } from "react";
import {
  GoogleAuthProvider,
  signInWithCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import {
  createUserProfile,
  listHabits,
  createHabit,
  deleteHabit,
  getOnboardingStatus,
  getUserInfo
} from "./firestore";

// import{
//   loadAffirmations
// } from "./second-firestore";
import "./App.css";
import "./Login.css";
// import icons from Lucide React
import { Eye, EyeOff } from "lucide-react";
import googleIcon from "./icons/google_icon.png";
import Menu from "./Menu";
import HabitCreate from "./habitCreate";
import Habit from "./habitComponents/habit";
import HabitDetails from "./HabitDetails";
import FriendsPage from "./FriendsPage";
import Messages from "./Messages";
import { AuthContext } from "./AuthContext";
import Onboarding from "./onboarding/Onboarding.jsx";
import Affirmation from "./onboarding/affirmation.jsx";
// import Messages from "./Messages.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [greetUsername, setGreetUsername] = useState(false);
  const [affirmations, setAffirmations] = useState([]);

  const [error, setAuthError] = useState(null);
  const [isSignUp, setIsSignUp] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alreadyOnboarded, setAlreadyOnboarded] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load in the habits for the user,
  // called after login and after edits/deletes to refresh the habit list
  const loadHabits = async (uid) => {
    if (!uid) return;
    try {
      const userHabits = await listHabits(uid);
      setHabits(userHabits);

      const alreadyOnboarded = await getOnboardingStatus(uid);
      // console.log("Already onboarded: ", alreadyOnboarded);
      setAlreadyOnboarded(alreadyOnboarded);

      const getUsername =  await getUserInfo(uid, "username");
      setUsername(getUsername);

      const getGreetUsername = await getUserInfo(uid, "greetUsername");
      setGreetUsername(getGreetUsername);

      const getAffirmations = await getUserInfo(uid, "affirmations");
      setAffirmations(getAffirmations);
      console.log("Affirmations: ", getAffirmations);
      setLoaded(true);

    } catch (error) {
      console.error("Error loading habits:", error);
    }
  };

  // user is logged in or out
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadHabits(currentUser.uid);
        // console.log("Username set: ", username);
      } else {
        setHabits([]);
        setLoaded(true);
      }
    });

    return () => {unsubscribe();};
  }, []);

  useEffect(() => {
  const checkOnboardingStatus = async () => {
    // 1. Safety check: if no user is logged in yet, stop here.
    if (!user?.uid) return;

    try {
      const status = await getOnboardingStatus(user.uid);
      // console.log("Already onboarded: ", status);
      setAlreadyOnboarded(status);
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  };

  // 2. Run the function normally (not in the return/cleanup)
  checkOnboardingStatus();

  // 3. Dependency should be [user], not [alreadyOnboarded]
  // This means "Re-check status whenever the logged-in user changes"
}, [user]); 

  // Allows for Google authentication for Google user sign-in
  const handleGoogleAuth = () => {
    chrome.identity.clearAllCachedAuthTokens(() => {
      // cleared cache tokens because of errors without it
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError || !token) {
          console.error("Sign-in failed", chrome.runtime.lastError);
          return;
        }

        const credential = GoogleAuthProvider.credential(null, token);

        signInWithCredential(auth, credential)
          .then(async (result) => {
            console.log("Logged in:", result.user.email);
            try {
              await createUserProfile(result.user.uid, {
                email: result.user.email,
                displayName: result.user.displayName,
              });
            } catch (error) {
              console.error("Error creating user profile:", error);
            }
          })
          .catch((err) => {
            console.error("Firebase Auth Error:", err);
          });
      });
    });
  };

  // Used for handling email sign-in outside of Google sign-in option
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        // SIGN IN
        await signInWithEmailAndPassword(auth, email, password);
        setAuthError(""); // clear error
      } else {
        // SIGN UP
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await createUserProfile(result.user.uid, {
          email: result.user.email,
          displayName: "",
          bio: "",
          onboarded: false,
          isPublic: false,
          avatar: null,
          earnedBadges: [],
        });
        setAuthError("");
      }
    } catch (err) {
      console.error(err);

      if (isSignUp) {
        if (err.code === "auth/invalid-credential") {
          setAuthError("No account found with these credentials.");
        } else {
          setAuthError("Sign up failed. " + err.code);
        }
      } else {
        if (err.code === "auth/email-already-in-use") {
          setAuthError("An account already exists with this email.");
        } else if (err.code === "auth/weak-password") {
          setAuthError("Password should be at least 6 characters.");
        } else {
          setAuthError("Sign up failed. " + err.code);
        }
      }
    }
  };

  const handleAddStandardHabit = async (title) => {
    setLoading(true);
    try {
      await createHabit(user.uid, { title: title });
      await loadHabits(user.uid);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // wrapper for saving a habit into the database
  const addHabit = async (habit) => {
    if (!user) return;

    await createHabit(user.uid, habit);
    await loadHabits(user.uid); // refresh habits
  };

  const handleDeleteHabit = async (habitId) => {
    if (!user) return;

    try {
      await deleteHabit(user.uid, habitId);
      await loadHabits(user.uid);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const handleGoHome = () => {
    setIsModalOpen(false);
    setNewHabitTitle("");
  };

  const [showPopup, setShowPopup] = useState(false);
  //  const [uid, setUid] = useState("USER_ID_FROM_FIREBASE"); // This is your existing UID

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [showFriendsPage, setShowFriendsPage] = useState(false);
  const [showMessagesPage, setShowMessagesPage] = useState(false);

  return (
    // home page after login
    <AuthContext.Provider value={user}>
      <div className="card">
        {user ? (
        // Check if data is loaded before showing the dashboard
        !loaded ? (
          <div className="loading-container">
            <div className="loading-bar" >
            </div>
          </div>
        ) : (
          <div>
             { !alreadyOnboarded &&
              <Onboarding hidden={alreadyOnboarded} user={user} 
              setAlreadyOnboarded={setAlreadyOnboarded} />
           }
            { selectedHabit ? (<HabitDetails
                habit={selectedHabit}
                uid={user.uid}
                loadHabits={loadHabits}
                onClose={() => setSelectedHabit(null)}
              />
            ) : (
              <div>
                <Menu
                  onHomeClick={handleGoHome}
                  onAddClick={() => setIsModalOpen(true)}
                  addHabit={addHabit}
                  uid={user.uid}
                  habits={habits}
                  setShowFriendsPage={setShowFriendsPage}
                  setShowMessagesPage={setShowMessagesPage}
                />
                <p hidden={showFriendsPage || showMessagesPage} style={{ fontSize: "20px", color: "black" }}>
                  Welcome, <strong>{(greetUsername && username) ? username : user?.email}</strong>!
                </p>

                <div 
                  style={{ 
                    display: showFriendsPage || showMessagesPage ? "none" : "flex",
                    justifyContent: "center", 
                    alignItems: "center",
                  }}
                >
                  <Affirmation user={user} affirmations={affirmations} />
                </div>

                {showFriendsPage && (
                  <div>
                    <FriendsPage />
                  </div>
                )}

                {showMessagesPage && (
                  <div>
                    <Messages />
                  </div>
                )}

                {/* Modal for habit adding */}
                {isModalOpen && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3>Add a New Habit</h3>

                      <section>
                        <h4>Quick Add:</h4>
                        <div className="standard-habits-grid">
                          {standardHabits.map((habit) => (
                            <button
                              key={habit}
                              onClick={() => {
                                handleAddStandardHabit(habit);
                              }}
                              className="standard-habit-btn"
                            >
                              {habit}
                            </button>
                          ))}
                        </div>
                      </section>

                      <hr />

                      <section>
                        <h4>Create Custom Habit:</h4>
                        <input
                          type="text"
                          value={newHabitTitle}
                          onChange={(e) => setNewHabitTitle(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleAddHabit()
                          }
                          placeholder="Enter a new habit..."
                          disabled={loading}
                        />
                        <div className="modal-actions">
                          <button onClick={handleAddHabit} disabled={loading}>
                            {loading ? "Adding..." : "Add Habit"}
                          </button>
                          <button
                            onClick={() => setIsModalOpen(false)}
                            className="cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </section>
                    </div>
                  </div>
                )}
                <div hidden={showFriendsPage || showMessagesPage}>
                  {/* // Display habits */}
                  <h2 style={{ fontSize: "28px", color: "black" }}>
                    Your Habits
                  </h2>
                  {/* <ul> */}
                  {habits.map((habit) => (
                    <Habit
                      key={habit.id}
                      habit={habit}
                      uid={user.uid}
                      loadHabits={loadHabits}
                      onEdit={() => setSelectedHabit(habit)}
                    />
                    // <li key={habit.id}>
                    //     <div>
                    //         <h3>{habit.title}</h3>
                    //         {habit.description && <p>{habit.description}</p>}
                    //         <span>{habit.frequency}</span>
                    //     </div>
                    //     <button
                    //         onClick={() => handleDeleteHabit(habit.id)}
                    //     >
                    //         Delete
                    //     </button>
                    // </li>
                  ))}
                  {/* </ul> */}

                  <div style={{ padding: "20px" }}>
                    {showPopup && (
                      <NewHabitForm
                        uid={user.uid}
                        onClose={() => setShowPopup(false)}
                      />
                    )}
                  </div>
                  {habits.length === 0 && (
                    <p>No habits yet. Create one to get started!</p>
                  )}
                </div>
                <br />
              </div>
            )}
          </div>
        )
        ) : (
          // sign in/sign up
          <div>
            {!loaded ? (
              <div className="loading-container">
                <div className="loading-bar" >
                </div>
              </div>
            ) : (
            <div id="login-container">
              <h1>{isSignUp ? "Welcome Back" : "Create Account"}</h1>
              <h2 id="login-subtitle">
                {isSignUp ? "Sign in to Habit.lio" : "Join Habit.lio"}
              </h2>
              <hr id="login-hr" />
              <p id="login-text">Track your habits and become a new you 🫵👑</p>
              {error && (
                <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
              )}
              <form onSubmit={handleEmailAuth}>
                <div id="email-container">
                  <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <br />
                <div id="password-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    id="toggle-password"
                    type="button"
                    title={passwordVisible ? "Hide Password" : "Show Password"}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <br />
                <button id="login" type="submit">
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </form>
              <h3>OR</h3>
              <button id="google-sign-in" onClick={handleGoogleAuth}>
                <img src={googleIcon} width="25px" height="25px" />
                &nbsp;{isSignUp ? "Sign in with Google" : "Sign up with Google"}
              </button>
              <br />
              <span id="no-account">
                {isSignUp
                  ? "Don't have an account?"
                  : "Already have an account?"}
                &nbsp;
                <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
                  {isSignUp ? "Sign Up" : "Sign In"}
                </a>
              </span>
              <br />
              <script type="module" src="login.js"></script>
            </div>
            )}
          </div>
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;