/*
    Login.jsx handles current user connection to the extension
 */

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import './Login.css'
import './index.css'
import hiddenIcon from './icons/hidden.png'
import notHiddenIcon from './icons/not_hidden.png'
import googleIcon from './icons/google_icon.png'

function LoginInput() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
    }

    return (
            <div>
                <form className="field" onSubmit={handleSubmit}>
                    <UsernameInput username={username} setUsername={setUsername} />
                    <PasswordInput  password={password} setPassword={setPassword} />
                    <button className="login_button">LOGIN</button>
                </form>
                <GoogleSignin />
                <Signup />
            </div>
    );
}

function Signup() {
    return (
        <div> {/* Placeholder link for now */}
            <p className="sign_up">Don't have an account? <a href="">Sign Up</a></p>
        </div>
    );
}

function GoogleSignin() {
    return (
        <div className="google_box">
            <span className="google_icon"><img src={googleIcon} /></span>
            <p className="google_signin_text">Sign in with Google</p>
        </div>
    )
}

function LoginFrame() {
    const signinText = "Sign in to Habit-lio";
    return (
        <div className="login_box">
            <p className="signin_text">{signinText}</p>
           
           <LoginInput />
        </div>
    );
}

function Title() {
    const title = "Habit-lio"
    return (
        <p className="title">{title}</p>
    );
}

function PasswordInput({ password, setPassword }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <div className="field_label">
                Password
            </div>

            <div className="input_wrapper">
                <input 
                type={showPassword ? "text" : "password"} /* Toggles password visibility */
                placeholder="Input"
                className="field_input" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />

                <span className="eye" onClick={() => setShowPassword(!showPassword)}>
                    <img 
                    src={showPassword ? notHiddenIcon : hiddenIcon}
                    alt="toggle password"
                    />
                </span>
            </div>
        </div>
    );
}

function UsernameInput({ username, setUsername }) {
    return (
      <div>
            <div className="field_label">
                Username
            </div>

            <div className="input_wrapper">
                <input 
                type="text"
                placeholder="Input"
                className="field_input" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
        </div>
    );
}

function Login() {
    return (
       <div>
            <Title />
            <LoginFrame />
       </div>
    );
}

export default Login;