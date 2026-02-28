// import { useState, useEffect } from "react";
// import { GoogleAuthProvider, signInWithCredential, onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase";
// import { createUserProfile, listHabits, createHabit, deleteHabit } from "./firestore";
import { House, Users, CirclePlus, CircleEllipsis, Mail } from 'lucide-react';
import './App.css';

function Menu({ onAddClick,onHomeClick }) {
    return (
        <div id="menu">
        <button id="home-btn" title="Home" onClick={onHomeClick}>
          <House color="black"/>
          </button>
          <span class="divider"></span>
          <button id="users-btn" title="Friends">
            <Users color="black"/>
            </button>
            <span class="divider"></span>
            <button id="add-btn" title="Add Habits" onClick={onAddClick}>
              <CirclePlus color="black" />
              </button>
              <span class="divider"></span>
              <button id="mail-btn" title="Messages">
                <Mail color="black" />
                </button>
                <span class="divider"></span>
              <button id="more-btn" title="More">
                <CircleEllipsis color="black" />
                </button>
      </div>
    )};

export default Menu;