
import "../css/Affirmation.css";
import { useEffect, useState } from "react";
import AffirmationEditing from "./AffirmationEditing";

function Affirmation({ user, affirmations, getAffirmations, setShowAffirmationEditing }) {
  const [userOpened, setuserOpened] = useState(user);
  const [visible, setVisible] = useState(false);
  const [affirmationsList, setAffirmationsList] = useState(affirmations || []);
  useEffect(() => {
    const list = affirmations || [];
    setAffirmationsList(list);
    setuserOpened(user);
  }, [affirmations], [user]); // Update local state when props change
  
  return (
    <div id="today-affirmation-container">
        <h2>Today's Affirmation</h2>
        {affirmationsList.length === 0 ? (
            <p>No affirmations found. Please create some affirmations to see them here!</p>
        ) : (
            <p>{affirmationsList[Math.floor(Math.random() * affirmationsList.length)]}</p>
        )}
        <button id="edit-affirmations" 
        onClick={() => {setShowAffirmationEditing(true); getAffirmations();}}>
          Edit Affirmations✏️
        </button>
    </div>
  );
}

export default Affirmation;