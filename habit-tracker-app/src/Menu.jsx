import { House, Users, Settings, Mail } from "lucide-react";
import "./App.css";
import HabitCreate from "./habitCreate";
import { useState } from "react";
import SettingsPopup from "./settingsMenuPopup";

function Menu({ onHomeClick }) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <div id="menu">
        {" "}
        <button id="home-btn" title="Home" onClick={onHomeClick}>
          {" "}
          <House color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>{" "}
        <button id="users-btn" title="Friends">
          {" "}
          <Users color="black" />{" "}
        </button>{" "}
        <span className="divider"></span>
        <HabitCreate /> <span className="divider"></span>{" "}
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
    </>
  );
}

export default Menu;
