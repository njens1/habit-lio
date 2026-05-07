import HabitEdit from "./habitEdit";
import { useEffect, useState } from "react";
import { toggleHabitCompletion, isHabitCompletedToday } from "../firestore";
import '../css/habit.css'

function Habit({habit, uid, loadHabits, completeHabitEarly, onEdit}){
    const habitName = habit.name ?? "";
    const dynamicFontSize = habitName.length > 15 ? "20px" : "30px";
    let dynamicGoalSize = "22px";
    if (habit.goal?.value >= 1000 && habit.goal?.value < 10000) {
      dynamicGoalSize = "20px";
    } else if (habit.goal?.value >= 10000) {
      dynamicGoalSize = "16px";
    } else {
      dynamicGoalSize = "22px";
    }
    const [isCompleted, setIsCompleted] = useState(isHabitCompletedToday(habit));
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
      setIsCompleted(isHabitCompletedToday(habit));
    }, [habit]);
    
    console.log("Habit Props:", habit); // Debugging line to check the props being passed to Habit component

    const handleToggleCompletion = async () => {
      if (isToggling) return; // Prevent multiple clicks
      
      setIsToggling(true);
      try {
        await toggleHabitCompletion(uid, habit.id);
        setIsCompleted((prev) => !prev);
        // Reload habits to get updated streak
        if (loadHabits) {
          await loadHabits(uid);
        }
      } catch (error) {
        console.error("Error toggling habit completion:", error);
      } finally {
        setIsToggling(false);
      }
    };

    const notifyHabitCompletion = () => {
      if (habit.isActive) {
        chrome.runtime.sendMessage({
          type: "notify",
          reason: "habitCompletion",
          message: `You have successfully completed the habit: ${habit.name}!`,
        });
      }
    };
  
  return(
    <div>
      <div className ="habit-created" style={{background: "linear-gradient(285deg, white, 1%, " + (habit.color ?? "#FFFFFF") + ")"}}>
      {/* <div className ="habit-created" style={{backgroundColor: habit.color ?? "#FFFFFF"}}> */}
        <input 
          type="checkbox" 
          className="habit-checkbox"
          checked={isCompleted}
          onChange={handleToggleCompletion}
          disabled={isToggling || !habit.isActive} // Disable checkbox while toggling or if habit is not active
          title={isCompleted ? "Mark as incomplete" : "Mark as complete"}
        />
        <h1 style={{fontSize: "64px"}}>{habit.emoji ?? "📝"}&nbsp;</h1>
        <div className='habit-info'>
            <h1 className='habit-name'
            style={{fontSize: dynamicFontSize, color: "black"}}>{habitName}</h1>
            <h2 
            style={{fontSize: dynamicGoalSize, color: "red"}}>
              Goal: {habit.goal.value === "" ? "0" : habit.goal.value}&nbsp; 
              {habit.goal.unit ?? "steps"}&nbsp;/&nbsp;{habit.goal?.period ?? "day"}</h2>
              <button className="habit-completed" 
              disabled={habit.endDate && new Date(habit.endDate) < new Date()}
              onClick={() => {completeHabitEarly(habit.id, !habit.isActive); notifyHabitCompletion(); }}>
                {habit.isActive ? "Complete Habit Early" : "Uncomplete Habit"}
              </button>
              <br />
        </div>
        <div className="habit-streak-edit">
          <h3 className="habit-streak" title="Habit Streak">🔥{habit.streak ?? 0}</h3>
          <HabitEdit habit={habit} uid={uid} loadHabits={loadHabits} onOpen={onEdit} />
        </div>
      </div>
      <br />
    </div>
  );
}

export default Habit;