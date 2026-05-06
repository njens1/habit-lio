import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "../css/calendar.css";
import Habit from "./habit";

// { date, habits, visible, setVisible }
function HabitOnDay(props) {
  const [habitsOnDay, setHabitsOnDay] = useState([]);
  // Evaluable the habits start date and end date to determine if the habit is 
  // active on the given date
  useEffect(() => {

    const now = new Date().setHours(0, 0, 0, 0);
    let habits = [];

    if(props.date === null) {
      setHabitsOnDay([]);
      return;
    }
    // If the given date is in the past, 
    // show all habits that were active on that date regardless of their current status
    if(props.date < now) {
      // Filter habits to find those that have a start and end date 
      // that includes the given date
      habits = props.habits.filter(habit => {
        const startDate = new Date(habit.startDate);
        const endDate = habit.endDate ? new Date(habit.endDate) : null;
        return startDate <= props.date && (!endDate || endDate >= props.date);
      });
    } 
    // If the given date is today or in the future, 
    // show only habits that are currently active.
    else{
      // Filter habits to find those that have a start and end date 
      // that includes the given date
      habits = props.habits.filter(habit => {
        const startDate = new Date(habit.startDate);
        const endDate = habit.endDate ? new Date(habit.endDate) : null;
        return startDate <= props.date && (!endDate || endDate >= props.date);
      });
      // Filter out habits that are not active on the given date
      const habitsUncompleted = habits.filter(habit => {
        return habit.isActive;
      });
      habits = habitsUncompleted;
    }


    // Filter out habits that were completed on the given date using streaks info
    // const habitsStreakChecked = habitsUncompleted.filter(habit => {
    //   const streaks = habit.completions || [];
    //   const streakFound
    //   streaks.map(streak => {
    //     const date = new Date(streak);
    //     const dateString = date.toISOString().split("T")[0];
    //     return dateString;
    //   }
    //   const dateString = props.date.toISOString().split("T")[0];
    //   return !streaks.includes(dateString);
    // });

    setHabitsOnDay(habits);
  }, [props.date, props.habits]);
  return(
    <div className="habits-on-day-container" hidden={!props.visible}>
      <div className="habits-on-day">
        <button
        id="forgot-password-close-btn"
        onClick={() => {
            props.setVisible(false);
        }}
        title="Close"
        >
        ✕
        </button>
        <div className="habits-on-day-inner">
          <h3 
          style={{color: "white", fontSize: "32px"}}>
            Habits to be done on {props.date ? 
            props.date.toLocaleDateString() : "No date selected"}</h3>
          {habitsOnDay.length > 0 ? (
            <div id="habits-on-day-list">
              {habitsOnDay.map(habit => (
                <Habit
                key={habit.id}
                habit={habit}
                uid={props.uid}
                loadHabits={props.loadHabits}
                completeHabitEarly={props.completeHabitEarly}
                onEdit={() => props.onEdit(habit)}
                />
              ))}
              </div>
          ) : (
            <p style={{color: "white", fontSize: "24px"}}>No habits for this day.</p>
          )}
        </div>
      </div>
    </div>
  )

}

//{habits}
function ToDoCalendar(props) {
  const [daySelected, setDaySelected] = useState(new Date());
  const [visible, setVisible] = useState(false);

  const handleDaySelect = (day) => {
    if (day) {
      setDaySelected(day);
      setVisible(true);
    }
  }
  return (
    <div className="todo-calendar">
      <h2 style={{color: "white"}}>To-Do Calendar</h2>
      {/* Calendar component goes here */}
        <div className="todo-calendar-container">
          <DayPicker
          className="calendar"
          style={{"--rdp-accent-color": "#000000"}}
          animate
              mode="single"
              captionLayout="dropdown"
              // disabled={{ before: new Date() }}
              selected={daySelected}
              onSelect={handleDaySelect}
              
              // startMonth={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
              // endMonth={new Date(2035, 6)} 
              />
        </div>
        <HabitOnDay date={daySelected} 
        habits={props.habits} 
        visible={visible} 
        setVisible={setVisible}
        uid={props.uid}
        loadHabits={props.loadHabits}
        completeHabitEarly={props.completeHabitEarly}
        onEdit={props.onEdit}
        />
    </div>
  );
}

export default ToDoCalendar;