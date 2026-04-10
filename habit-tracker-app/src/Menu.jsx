/*
  Menu.jsx is a navigation bar for transitions between pages
 */

import { House, Users, Settings, Mail, Medal, CircleUser } from "lucide-react";
import "./App.css";
import Profile from "./Profile.jsx";
import HabitCreate from "./habitCreate";
import { useState } from "react";
import SettingsPopup from "./Settings.jsx";
import Badges from "./Badges.jsx";

function Menu({ onHomeClick, addHabit, setShowFriendsPage, setShowMessagesPage, uid, habits }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    <>
      <div id="menu">
        {" "}
        <button
          id="home-btn"
          title="Home"
          onClick={() => {
            onHomeClick;
            setShowFriendsPage(false);
            setShowMessagesPage(false);
          }}
        >
          {" "}
          <House color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>
        <HabitCreate
          addHabit={addHabit}
        /> <span className="divider"></span>{" "}
        <button
          id="badges-btn"
          title="Badges"
          onClick={() => setShowBadges(true)}
        >
          <Medal color="black" />
        </button>
        <span className="divider" />
        <button
          id="profile-btn"
          title="Profile"
          onClick={() => setShowProfile(true)}
        >
          <CircleUser color="black" />
        </button>
        <span className="divider" />
        <button
          id="friends-btn"
          title="Friends"
          onClick={() => {
            setShowFriendsPage(true);
            setShowMessagesPage(false);
          }}
        >
          {" "}
          <Users color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>
        <button 
          id="mail-btn" 
          title="Messages"
          onClick={() => {
            setShowMessagesPage(true);
            setShowFriendsPage(false);
          }}
        >
          {" "}
          <Mail color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>{" "}
        <button
          id="more-btn"
          title="Settings"
          onClick={() => setShowSettings(true)}
        >
          {" "}
          <Settings color="black" />{" "}
        </button>{" "}
      </div>

      {showSettings && (
        <SettingsPopup closePopup={() => setShowSettings(false)} />
      )}

      {showProfile && (
        <Profile uid={uid} onClose={() => setShowProfile(false)} />
      )}

      {showBadges && (
        <Badges
          uid={uid}
          habits={habits}
          onClose={() => setShowBadges(false)}
        />
      )}
    </>
  );
}

export default Menu;
