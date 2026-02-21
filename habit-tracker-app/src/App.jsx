import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { createUserProfile, listHabits, createHabit, deleteHabit, exportHabits } from "./firestore";
import './App.css';
import './Login.css';
// import icons from Lucide React
import {Eye, EyeOff} from 'lucide-react';
import googleIcon from './icons/google_icon.png';
import Menu from "./Menu";

function App() {
    const [user, setUser] = useState(null);
    const [habits, setHabits] = useState([]);
    const [newHabitTitle, setNewHabitTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setAuthError] = useState(null);
    const [isSignUp, setIsSignUp] = useState(true);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const loadHabits = async (uid) => {
        try {
            const userHabits = await listHabits(uid);
            setHabits(userHabits);
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
            } else {
                setHabits([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = () => {
        chrome.identity.clearAllCachedAuthTokens(() => { // cleared cache tokens because of errors without it
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
                                displayName: result.user.displayName
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

    const handleSignOut = () => {
        auth.signOut().then(() => {
            chrome.identity.getAuthToken({ interactive: false }, (token) => {
                if (token) {
                    chrome.identity.removeCachedAuthToken({ token }, () => {});
                }
            });
        });
    };

    const handleEmailAuth = async (event) => {
        event.preventDefault();
        setAuthError(null);
        try {
            if (isSignUp) {
                // sign up if no account
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserProfile(userCredential.user.uid, { email: userCredential.user.email });
                console.log("User registered");
            } else {
                // sign in with email
                await signInWithEmailAndPassword(auth, email, password);
                console.log("User signed in");
            }
        } catch (error) {
            setAuthError(error.message);
            console.error("Auth error:", error.message);
        }
    };

    const handleAddHabit = async () => {
        if (!newHabitTitle.trim() || !user) return;

        setLoading(true);
        try {
            await createHabit(user.uid, { title: newHabitTitle });
            setNewHabitTitle("");
            await loadHabits(user.uid);
        } catch (error) {
            console.error("Error creating habit:", error);
        } finally {
            setLoading(false);
        }
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

    const handleExportHabits = async () => {
        if (!user) return;
        try {
            console.log("Attempted export");
            await exportHabits(user.uid);
        } catch (error) {
            console.error("Error exporting habits:", error);
        }
    };

    return ( // home page after login
        <div className="card">
            {/* <h1>Habit-lio</h1> */}
            {user ? (
                <div>
                    <Menu />
                    <p>Welcome, <strong>{user.email}</strong>!</p>
                    
                    <div>
                        <h2>Your Habits</h2>
                        
                        <div>
                            <input
                                type="text"
                                value={newHabitTitle}
                                onChange={(e) => setNewHabitTitle(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                                placeholder="Enter a new habit..."
                                disabled={loading}
                            />
                            <button onClick={handleAddHabit} disabled={loading}>
                                {loading ? "Adding..." : "Add Habit"}
                            </button>
                        </div>

                        <ul>
                            {habits.map((habit) => (
                                <li key={habit.id}>
                                    <div>
                                        <h3>{habit.title}</h3>
                                        {habit.description && <p>{habit.description}</p>}
                                        <span>{habit.frequency}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteHabit(habit.id)}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div>
                            <button onClick={() => handleExportHabits()}>Export Habits to CSV</button>
                        </div>
                        {habits.length === 0 && <p>No habits yet. Create one to get started!</p>}
                    </div>

                    <button onClick={handleSignOut}>Sign Out</button>
                </div>
            ) : ( // sign in/sign up
                <div>
                    <div id="login-container">
                        <h1>{isSignUp ? "Welcome Back" : "Create Account"}</h1>
                        <h2 id="login-subtitle">{isSignUp ? "Sign in to Habit.lio" 
                        : "Join Habit.lio"}</h2>
                        <hr id="login-hr" />
                        <p id="login-text">Track your habits and become a new you 🫵👑</p>
                        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                        <form onSubmit={handleEmailAuth}>
                            <div id="email-container">
                                <input type="email" id="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </div>
                            <br />
                            <div id = "password-container">
                                <input type={passwordVisible ? "text" : "password"} id="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                <button id="toggle-password" type="button" title={passwordVisible ? "Hide Password" : "Show Password"}  
                                onClick={() =>setPasswordVisible(!passwordVisible) }>
                                    {passwordVisible ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            <br />
                            <button id="login" type="submit">{isSignUp ? "Sign In" : "Sign Up"}</button>
                        </form>        
                        <h3>OR</h3>
                        <button id="google-sign-in" onClick={handleGoogleSignIn}>
                            <img src={googleIcon} width="25px" height="25px" />
                            &nbsp;{ isSignUp ? "Sign in with Google" : "Sign up with Google"}
                        </button>
                        <br />
                        <span id="no-account"> 
                            {isSignUp ? "Don't have an account?" : "Already have an account?"}&nbsp;
                            <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? "Sign Up" : "Sign In"}
                            </a>
                        </span>
                        <br />
                        <script type="module" src="login.js"></script>
                     </div>
                    {/* I ACCOMPLISHED ALL AT BOTTOM 
                    <p>Track your habits!</p>
                    <form onSubmit={handleEmailAuth}>
                        <h2>{isSignUp ? "Create Account" : "Welcome Back"}</h2>
                        <div>
                            <label style={{ color: 'white' }}>Email:</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <label style={{ color: 'white' }}>Password:</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
                        {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                    </form>
                    
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
                    </button>

                    <div style={{margin: '15px 0'}}>OR</div>
                    <button onClick={handleGoogleSignIn}>Sign in with Google</button> */}
                </div>
            )}
        </div>
    );
}

export default App;


//import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
//
// function App() {
//   const [count, setCount] = useState(0)
//
//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }
//
// export default App
