import { House, Users, Settings, Mail, Medal } from "lucide-react";
import "./App.css";
import HabitCreate from "./habitCreate";
import { useState } from "react";
import SettingsPopup from "./Settings.jsx";
import Badges from "./Badges.jsx";

function Menu({ onHomeClick, addHabit, setShowFriendsPage, uid, habits }) {
  const [showSettings, setShowSettings] = useState(false);
  const [showBadges, setShowBadges] = useState(false);
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
          }}
        >
          {" "}
          <House color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>{" "}
        <button
          id="badges-btn"
          title="Badges"
          onClick={() => setShowBadges(true)}
        >
          <Medal color="black" />
        </button>
        <span className="divider" />
        <button
          id="users-btn"
          title="Friends"
          onClick={() => setShowFriendsPage(true)}
        >
          {" "}
          <Users color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>
        <HabitCreate
          addHabit={addHabit}
        /> <span className="divider"></span>{" "}
        <button id="mail-btn" title="Messages">
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
