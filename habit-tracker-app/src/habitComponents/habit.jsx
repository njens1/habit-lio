import HabitEdit from "./habitEdit";
import { useEffect, useState } from "react";
import HabitDetails from "../HabitDetails.jsx";
import '../css/habit.css'

function Habit({habit, uid, loadHabits, onEdit}){
    const [showDetails, setShowDetails] = useState(false);
    const dynamicFontSize = habit.name.length > 15 ? "20px" : "30px";
    console.log("Habit Props:", habit); // Debugging line to check the props being passed to Habit component

  return(
    <div>
      <div className ="habit-created" style={{backgroundColor: habit.color ?? "#FFFFFF"}}>
        <h1 style={{fontSize: "64px"}}>📝&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: dynamicFontSize, color: "black"}}>{habit.name}</h1>
            <h2 
            style={{fontSize: "24px", color: "red"}}>
              Goal: {habit.goal.value ? habit.goal.value : "0"}&nbsp; 
              {habit.goal.unit ? habit.goal.unit : "steps"}/{habit.period ? habit.period : "week"}</h2>
        </div>
        <div className="habit-streak-edit">
          {/* <h3 className="habit-streak" title="Habit Streak">🔥{habit.streak ? habit.streak : "0"}</h3> */}
          <h3 className="habit-streak" title="Habit Streak">🔥0</h3>
          <HabitEdit habit={habit} uid={uid} loadHabits={loadHabits} onOpen={onEdit}/>
        </div>
      </div>
      <br />
    </div>
  );
}

export default Habit;