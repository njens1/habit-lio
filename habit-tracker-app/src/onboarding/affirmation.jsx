
import "../css/Affirmation.css";
import { useEffect, useState } from "react";
import AffirmationEditing from "./AffirmationEditing";

function Affirmation({ user, affirmations, getAffirmations }) {
  const [userOpened, setuserOpened] = useState(user);
  const [visible, setVisible] = useState(false);
  const [affirmationsList, setAffirmationsList] = useState(affirmations);
  useEffect(() => {
    setAffirmationsList(affirmations);
    setuserOpened(user);
  }, [affirmations], [user]); // Update local state when props change
  
  return (
    <div id="today-affirmation-container">
        <AffirmationEditing user={userOpened} visible={visible} 
        setVisible={setVisible} affirmations={affirmationsList} />
        <h2>Today's Affirmation:</h2>
        <p>{affirmationsList[Math.floor(Math.random() * affirmationsList.length)]}</p>
        <button id="edit-affirmations" 
        onClick={() => {setVisible(!visible); getAffirmations();}}>
          Edit Affirmations✏️
        </button>
    </div>
  );
}

export default Affirmation;