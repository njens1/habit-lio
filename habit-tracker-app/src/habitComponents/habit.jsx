import HabitEdit from "./habitEdit";
import { useEffect } from "react";
import '../css/habit.css'

function Habit(props){
    const dynamicFontSize = props.name.length > 15 ? "20px" : "30px";
  return(
    <div>
      <div className ="habit-created">
        <h1 style={{fontSize: "64px"}}>📝&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: dynamicFontSize, color: "black"}}>{props.name}</h1>
            <h2 
            style={{fontSize: "24px", color: "red"}}>
              Goal: {props.goal ? props.goal : "0"}/{props.period ? props.period : "week"}</h2>
        </div>
        <h3 className="habit-streak" title="Habit Streak">🔥{props.streak ? props.streak : "0"}</h3>
        <HabitEdit />
      </div>
      <br />
    </div>
  );
}

export default Habit;