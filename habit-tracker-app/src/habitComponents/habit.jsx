import HabitEdit from "./habitEdit";
import { useEffect } from "react";
import '../css/habit.css'

function Habit(props){
    const dynamicFontSize = props.name.length > 15 ? "20px" : "30px";
    console.log("Habit Props:", props); // Debugging line to check the props being passed to Habit component
  return(
    <div>
      <div className ="habit-created" style={{backgroundColor: props.color ?? "#FFFFFF"}}>
        <h1 style={{fontSize: "64px"}}>📝&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: dynamicFontSize, color: "black"}}>{props.name}</h1>
            <h2 
            style={{fontSize: "24px", color: "red"}}>
              Goal: {props.goal ? props.goal : "0"}&nbsp; 
              {props.unit ? props.unit : "steps"}/{props.period ? props.period : "week"}</h2>
        </div>
        <div className="habit-streak-edit">
          <h3 className="habit-streak" title="Habit Streak">🔥{props.streak ? props.streak : "0"}</h3>
          <HabitEdit />
        </div>
      </div>
      <br />
    </div>
  );
}

export default Habit;