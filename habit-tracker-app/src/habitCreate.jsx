/*
  habitCreate.jsx is used for handling user habit creation for both custom and preselected habits
 */

import { useState } from "react";
import { auth } from "./firebase";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserProfile,
  listHabits,
  createHabit,
  deleteHabit,
  exportHabits,
} from "./firestore";
import "./habit-creation.css";
import Calendar from "./habitComponents/Calendar";
import EmojiSelect from "./habitComponents/EmojiSelect";

import {
  X,
  Flame,
  Activity,
  Volleyball,
  HouseHeart,
  GraduationCap,
  Plus,
  ChevronLeft,
  CirclePlus,
  DockIcon,
} from "lucide-react";
import { doc } from "firebase/firestore";

function showPopup(show) {
  const popup = document.getElementById("popup-container");
  popup.style.display = show ? "block" : "none";
}

function HabitOption({ name, onAddClick, modifyHabit, modifyEmoji }) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="habit-options">
          <div id="habit-container">
            <p style={{ fontSize: "36px", color: "black" }}>{name}</p>
            <button
              style={{ borderRadius: "50%" }}
              className="habit-plus"
              onClick={() => {
                onAddClick();
                modifyHabit();
                modifyEmoji();
              }}
            >
              <Plus color="#000000" />
            </button>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
}

function HabitWindow(props) {
  // document.getElementById("habitCategory").textContent = viewing ? viewing : "Habit Window";
  const descriptions = {
    Popular: "Most Popular Habits",
    Health: "Your Medical & Wellness Goals",
    Exercise: "Fitness & Activity",
    Financial: "Money Management",
    Learning: "Educational & Skill Development",
    Custom: "Create Your Own Habit",
  };
  var categorySelected = props.viewing;
  return (
    <div>
      <div id="habit-window">
        <h1 id="habitCategory">{categorySelected}</h1>
        <p id="category-description">{descriptions[categorySelected]}</p>
        <div
          hidden={categorySelected !== "Popular"}
          className="custom-habit-form"
        >
          <HabitOption
            name="🚶 Walk"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Walk")}
            modifyEmoji={() => props.onSelectEmoji("🚶")}
          />
          <HabitOption
            name="🏃‍♂️ Run"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Run")}
            modifyEmoji={() => props.onSelectEmoji("🏃‍♂️")}
          />
          <HabitOption
            name="🛌 Sleep"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Sleep")}
            modifyEmoji={() => props.onSelectEmoji("🛌")}
          />
          <HabitOption
            name="📚 Study"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Study")}
            modifyEmoji={() => props.onSelectEmoji("📚")}
          />
        </div>
        <div
          hidden={categorySelected !== "Health"}
          className="custom-habit-form"
        >
          <HabitOption
            name="🍽️ Eat Snack"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Eat Snack")}
            modifyEmoji={() => props.onSelectEmoji("🍽️")}
          />
          <HabitOption
            name="🪥 Brush Teeth"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Brush Teeth")}
            modifyEmoji={() => props.onSelectEmoji("🪥")}
          />
          <HabitOption
            name="💧 Drink Water"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Drink Water")}
            modifyEmoji={() => props.onSelectEmoji("💧")}
          />
          <HabitOption
            name="🛌 Sleep"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Sleep")}
            modifyEmoji={() => props.onSelectEmoji("🛌")}
          />
          <HabitOption
            name="🧘 Meditate"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Meditate")}
            modifyEmoji={() => props.onSelectEmoji("🧘")}
          />
        </div>
        <div
          hidden={categorySelected !== "Exercise"}
          className="custom-habit-form"
        >
          <HabitOption
            name="🚶 Walk"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Walk")}
            modifyEmoji={() => props.onSelectEmoji("🚶")}
          />
          <HabitOption
            name="🏃‍♂️ Run"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Run")}
            modifyEmoji={() => props.onSelectEmoji("🏃‍♂️")}
          />
          <HabitOption
            name="🚴 Bike"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Bike")}
            modifyEmoji={() => props.onSelectEmoji("🚴")}
          />
          <HabitOption
            name="🏋️ Lift Weights"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Lift Weights")}
            modifyEmoji={() => props.onSelectEmoji("🏋️")}
          />
          <HabitOption
            name="🤸 Stretch"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Stretch")}
            modifyEmoji={() => props.onSelectEmoji("🤸")}
          />
          <HabitOption
            name="🧘 Meditate"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Meditate")}
            modifyEmoji={() => props.onSelectEmoji("🧘")}
          />
        </div>
        <div
          hidden={categorySelected !== "Financial"}
          className="custom-habit-form"
        >
          <HabitOption
            name="💰 Save Money"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Save Money")}
            modifyEmoji={() => props.onSelectEmoji("💰")}
          />
          <HabitOption
            name="📈 Invest"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Invest")}
            modifyEmoji={() => props.onSelectEmoji("📈")}
          />
          <HabitOption
            name="📉 Spend Less"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Spend Less")}
            modifyEmoji={() => props.onSelectEmoji("📉")}
          />
          <HabitOption
            name="🧾 Pay Bills"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Pay Bills")}
            modifyEmoji={() => props.onSelectEmoji("🧾")}
          />
          <HabitOption
            name="📝 Apply for Jobs"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Apply for Jobs")}
            modifyEmoji={() => props.onSelectEmoji("📝")}
          />
        </div>
        <div
          hidden={categorySelected !== "Learning"}
          className="custom-habit-form"
        >
          <HabitOption
            name="📚 Study"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Study")}
            modifyEmoji={() => props.onSelectEmoji("📚")}
          />
          <HabitOption
            name="🧑‍🏫 Attend Class"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Attend Class")}
            modifyEmoji={() => props.onSelectEmoji("🧑‍🏫")}
          />
          <HabitOption
            name="📝 Take Notes"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Take Notes")}
            modifyEmoji={() => props.onSelectEmoji("📝")}
          />
          <HabitOption
            name="📖 Read"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Read")}
            modifyEmoji={() => props.onSelectEmoji("📖")}
          />
          <HabitOption
            name="🧑‍💻 Code"
            onAddClick={() => props.onSelectCustom()}
            modifyHabit={() => props.onSelectName("Code")}
            modifyEmoji={() => props.onSelectEmoji("🧑‍💻")}
          />
        </div>
      </div>
    </div>
  );
}

function CheckBoxDay({ name, setDaysSelected }) {
  // Start checked by default
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    const nextCheckedState = !checked;
    setChecked(nextCheckedState);

    if (nextCheckedState) {
      // Logic to ADD to the array (assuming setDaysSelected is an array setter)
      setDaysSelected((prev) => [...prev, name]);
    } else {
      // Logic to REMOVE from the array
      setDaysSelected((prev) => prev.filter((day) => day !== name));
    }
  };

  return (
    <div style={{ fontSize: "14px" }}>
      <input
        type="checkbox"
        id={name}
        name={name}
        checked={checked}
        // FIXED: Wrapped in an arrow function so it only runs on click
        onChange={() => handleToggle()}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}

function SelectTaskDays(props) {
  // const [error, showError] = useState(false);
  const isError = props.daysSelected.length === 0;
  props.setClicked(props.mode === "specific_days" && isError);

  const isError2 = props.daysInMonthSelected.length === 0;
  props.setClicked(props.mode === "specific_month_days" && isError2);

  console.log("DAYS:" + props.daysSelected);
  return (
    <div>
      {props.mode === "specific_month_days" && (
        <div id="task-days-select">
          <p
            className="days-error"
            style={{ color: "red", fontSize: "14px" }}
            hidden={!isError2}
          >
            Error: Please select at least one day.
          </p>
          <Calendar
            daysInMonthSelected={props.daysInMonthSelected}
            setDaysInMonthSelected={props.setDaysInMonthSelected}
          />
        </div>
      )}
      {props.mode === "specific_days" && (
        <div>
          <p
            className="days-error"
            style={{ color: "red", fontSize: "14px" }}
            hidden={!isError}
          >
            Error: Please select at least one day.
          </p>
          <label htmlFor="specific-days" style={{ fontSize: "16px" }}>
            Choose Day(s) to accomplish the habit:{" "}
          </label>
          <CheckBoxDay name="Monday" setDaysSelected={props.setDaysSelected} />
          <CheckBoxDay name="Tuesday" setDaysSelected={props.setDaysSelected} />
          <CheckBoxDay
            name="Wednesday"
            setDaysSelected={props.setDaysSelected}
          />
          <CheckBoxDay
            name="Thursday"
            setDaysSelected={props.setDaysSelected}
          />
          <CheckBoxDay name="Friday" setDaysSelected={props.setDaysSelected} />
          <CheckBoxDay
            name="Saturday"
            setDaysSelected={props.setDaysSelected}
          />
          <CheckBoxDay name="Sunday" setDaysSelected={props.setDaysSelected} />
        </div>
      )}
      {props.mode === "number_days" && (
        <div>
          <label htmlFor="number-days" style={{ fontSize: "16px" }}>
            Enter the number of days per week you want to accomplish this habit:
          </label>
          <input
            type="number"
            id="number-days"
            min="1"
            max="7"
            onChange={(e) => props.setNumOfDays(parseInt(e.target.value) || 1)}
          />
        </div>
      )}
      {props.mode === "specific_month_number" && (
        <div>
          <label htmlFor="number-month-days" style={{ fontSize: "16px" }}>
            Enter the number of days per month you want to accomplish this
            habit:
          </label>
          <input
            type="number"
            id="number-month-days"
            min="1"
            max="31"
            onChange={(e) => props.setNumOfDays(parseInt(e.target.value) || 1)}
          />
        </div>
      )}
    </div>
  );
}

// BACKEND FUNCTIONALITIES SHOULD BE ADDED HERE!
function CreateHabitForm(props) {
  console.log("In CreateHabitForm:", props);
  const [clicked, setClicked] = useState(false);
  const [taskDaysSelected, setTaskDaysSelected] = useState("everyday");
  const [daysSelected, setDaysSelected] = useState([]);
  const [daysInMonthSelected, setDaysInMonthSelected] = useState([]);
  const [numOfDays, setNumOfDays] = useState(0);
  const [emoji, setEmoji] = useState(props.emoji || "📝");
  // Access the user from the AuthContext
  const user = useContext(AuthContext);
  console.log("Current user in CreateHabitForm:", user ? user.uid : null); // Debugging line

  const [habitType, setHabitType] = useState("Build");
  const [periodSelected, setPeriod] = useState("Day");
  const [color, setColor] = useState("#b9b7b7");
  const [reminder, setReminder] = useState(false);
  const [remindTime, setRemindTime] = useState("");

  // When users are deciding task days, we need to refresh to
  // ensure data type consistency.
  const refreshDays = () => {
    setDaysSelected([]);
  };

  const handleAddHabit = async (createdHabit) => {
    if (!user) return;

    try {
      await props.addHabit(createdHabit);
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  // Handles what happen you select what type of habit you want to create (build or quit)
  const selectType = (type) => {
    setHabitType(type);
    if (type === "Build") {
      document.getElementById("build-option").style.backgroundColor = "#5B5FB4";
      document.getElementById("build-option").style.color = "white";
      document.getElementById("quit-option").style.backgroundColor =
        "#b9b7b700";
      document.getElementById("quit-option").style.color =
        "rgba(0, 0, 0, 0.25)";

      // document.getElementById("quit-option").style.backgroundColor = "#ffffff";
    } else {
      document.getElementById("quit-option").style.backgroundColor = "#5B5FB4";
      document.getElementById("quit-option").style.color = "white";
      document.getElementById("build-option").style.backgroundColor =
        "#b9b7b700";
      document.getElementById("build-option").style.color =
        "rgba(0, 0, 0, 0.25)";
      // document.getElementById("build-option").style.backgroundColor = "#ffffff";
    }
  };
  return (
    <div>
      <form
        id="create-habit-form"
        onSubmit={async (e) => {
          e.preventDefault();

          const createdHabit = {
            name: document.getElementById("habit-name-created").value,
            description: document.getElementById("habit-description").value,
            type: habitType,
            color: color,
            emoji: emoji,
            goal: {
              value: document.getElementById("value").value,
              unit: document.getElementById("unit").value,
              period: periodSelected,
              taskDays: document.getElementById("task-day").value,
              // Days Selected are the days selected out of a week
              daysSelected: daysSelected,
              //
              daysInMonthSelected: daysInMonthSelected,
              // Number of days selected out of a week or month.
              numOfDays: numOfDays,
            },
            reminder: {
              activated: reminder,
              time: remindTime,
              message: document.getElementById("reminder-message").value,
            },
            priority: document.getElementById("priority1").value,
            startDate: document.getElementById("start-date-create").value,
            endDate: document.getElementById("end-date-create").value,
            isActive: true,
          };

          // if (reminder && remindTime) {

          // }

          handleAddHabit(createdHabit);
          // await handleAddHabit(createdHabit);
          chrome.runtime.sendMessage({
            type: "notify",
            reason: "habitCreation",
            message: `You have successfully created the habit: ${createdHabit.name}!`,
          });

          setClicked(true);
          props.onSubmission();
        }}
      >
        {/* Initial Info */}
        <div id="habit-form-first-row">
          <div id="habit-circle-created">
            <div
              id="habit-emoji"
              style={{
                backgroundColor: color,
                width: "10em",
                height: "10em",
                borderRadius: "50%",
              }}
            >
              <EmojiSelect
                value={emoji}
                onChange={(emoji) => {
                  setEmoji(emoji);
                }}
              />
            </div>
            <br />
            <span>
              <label htmlFor="color-picker">Set Color: </label>
              <select
                name="color-picker"
                id="color-picker"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="#b9b7b7">Default</option>
                <option value="#f8aaaa">Red</option>
                <option value="#aaffaa">Green</option>
                <option value="#aaaaff">Blue</option>
                <option value="#ffffaa">Yellow</option>
                <option value="#ffb6c1">Pink</option>
                <option value="#ffa500">Orange</option>
                <option value="#800080">Purple</option>
              </select>

              {/* <input type="color" id="color-picker" 
                            name="emoji-color" value={color} onChange={(e) => setColor(e.target.value)}/> */}
            </span>
          </div>
          <div id="habit-info">
            <label
              htmlFor="habit-name-created"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Habit Name
            </label>
            <input
              type="text"
              id="habit-name-created"
              name="habit-name-created"
              placeholder="Habit Name"
              value={props.habitName}
              onChange={(e) => props.setHabitName(e.target.value)}
              required
            />
            <br />
            {/* <br /> */}
            <label
              htmlFor="habit-description"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Habit Description
            </label>
            <textarea
              id="habit-description"
              maxlength="100"
              name="habit-description"
              placeholder="Add Description"
            />
          </div>
        </div>
        <br />
        <hr style={{ color: "#000000", width: "100%" }} />
        {/* Habit Type */}
        <div id="habit-form-second-row">
          <h2 style={{ fontSize: "24px", textAlign: "center" }}>Habit Type</h2>
          <div id="habit-type-options-created">
            <button
              type="button"
              className="habit-type-option1"
              id="build-option"
              onClick={() => selectType("Build")}
            >
              Build
            </button>
            <button
              type="button"
              className="habit-type-option1"
              id="quit-option"
              onClick={() => selectType("Quit")}
            >
              Quit
            </button>
          </div>
        </div>
        {/* Goal Info */}
        <hr style={{ color: "#000000", width: "100%" }} />
        <div id="habit-form-third-row">
          <h2 style={{ fontSize: "24px", textAlign: "center" }}>Goal Info</h2>
          <div id="goal-period">
            <label
              htmlFor="period"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Goal Period:{" "}
            </label>
            <select
              name="period"
              id="period"
              style={{ fontSize: "18px", textAlign: "center" }}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="Day">Daily</option>
              <option value="Week">Weekly</option>
              <option value="Month">Monthly</option>
            </select>
          </div>
          <br />
          <div id="goal-value">
            <label
              htmlFor="value"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Goal Value:{" "}
            </label>
            <input
              type="number"
              id="value"
              name="value"
              min="1"
              style={{ fontSize: "18px", textAlign: "center", width: "30%" }}
            />
            <select
              name="unit"
              id="unit"
              aria-label="unit"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              <option value="steps">steps</option>
              <option value="gallons">gallons</option>
              <option value="liters">liters</option>
              <option value="pages">pages</option>
              <option value="words">words</option>
              <option value="dollars">dollars</option>
              <option value="hours">hours</option>
              <option value="minutes">minutes</option>
            </select>
            <label
              htmlFor="period-selected"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              {" "}
              / {periodSelected}{" "}
            </label>
          </div>
          <br />
          <div id="task-days">
            <label style={{ fontSize: "18px", textAlign: "center" }}>
              Task Days:{" "}
            </label>
            <select
              name="task-day"
              id="task-day"
              style={{ fontSize: "18px", textAlign: "center" }}
              onChange={(e) => setTaskDaysSelected(e.target.value)}
            >
              <option value="everyday">Everyday</option>
              <option value="specific_days">Specific days of the week</option>
              <option value="number_days">Number of days per week</option>
              <option value="specific_month_days">
                Specific days of the month
              </option>
              <option value="specific_month_number">
                Number of days per month
              </option>
            </select>
          </div>
          <SelectTaskDays
            mode={taskDaysSelected}
            setClicked={setClicked}
            daysSelected={daysSelected}
            setDaysSelected={setDaysSelected}
            daysInMonthSelected={daysInMonthSelected}
            setDaysInMonthSelected={setDaysInMonthSelected}
            setNumOfDays={setNumOfDays}
          />
        </div>
        <hr style={{ color: "#000000", width: "100%" }} />
        {/* Reminder Settings */}
        <div id="habit-form-fourth-row">
          <h2 style={{ fontSize: "24px", textAlign: "center" }}>
            Reminder Settings
          </h2>
          <div id="reminder-options">
            <label
              htmlFor="reminder-activated"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Want to be reminded?{" "}
            </label>
            <input
              type="checkbox"
              id="reminder-activated"
              name="reminder-activated"
              style={{ fontSize: "18px" }}
              onChange={(e) => {
                document.getElementById("yes-reminder").hidden =
                  !e.target.checked;
                setReminder(e.target.checked);
              }}
            ></input>
            <br />
            <div id="yes-reminder" hidden={true}>
              <label
                htmlFor="reminder-time"
                style={{ fontSize: "18px", textAlign: "center" }}
              >
                Select Time:{" "}
              </label>
              <input
                type="time"
                id="reminder-time"
                name="reminder-time"
                style={{ fontSize: "18px", textAlign: "center" }}
                onChange={(e) => setRemindTime(e.target.value)}
              ></input>
              <br />
              <br />
              <textarea
                id="reminder-message"
                aria-label="Reminder Message"
                maxlength="100"
                placeholder="Reminder Message here"
              />
            </div>
          </div>
        </div>
        <hr style={{ color: "#000000", width: "100%" }} />
        <div id="submit-button-container">
          <div id="priority-setting">
            <label
              htmlFor="priority1"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              Set Priority:{" "}
            </label>
            <select
              name="priority1"
              id="priority1"
              style={{ fontSize: "18px", textAlign: "center" }}
            >
              <option value="none">No Preference</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <h2 style={{ fontSize: "20px", textAlign: "center" }}>Habit Term</h2>
          <div id="habit-term">
            <div id="start-date-container">
              <p style={{ fontSize: "16px", textAlign: "center" }}>
                Start Date
              </p>
              <input
                type="date"
                id="start-date-create"
                name="start-date-create"
                style={{ fontSize: "18px", textAlign: "center" }}
              ></input>
            </div>
            <div id="end-date-container">
              <p style={{ fontSize: "16px", textAlign: "center" }}>End Date</p>
              <input
                type="date"
                id="end-date-create"
                name="end-date-create"
                style={{ fontSize: "18px", textAlign: "center" }}
              ></input>
            </div>
          </div>
          <br />
          <button
            type="submit"
            id="submit-button1"
            title={
              clicked ? "Please fill in all required fields" : "Create Habit"
            }
            disabled={clicked}
            style={{
              backgroundColor: "#acacac",
              color: "black",
              fontWeight: "bold",
            }}
          >
            Create Habit
          </button>
        </div>
      </form>
      <br />
    </div>
  );
}

function HabitCreate({ addHabit }) {
  const [clicked, setClicked] = useState(false);
  const [category, setCategory] = useState("Popular");
  const [habitName, setHabitName] = useState("");
  const [emoji, setEmoji] = useState("📝");

  // Handle closing the popup and resetting all states to default
  const handleClose = () => {
    setCategory("Popular");
    handleSelect(category);
    setEmoji("📝");
    setHabitName("");
    showPopup(false);
  };

  const handleClick = () => {
    handleSelect(category);
    setClicked(!clicked);
    showPopup(!clicked);
  };

  const handleSelect = (categoryName) => {
    var availableCategories = document.getElementsByClassName("habit-type");
    for (var i = 0; i < availableCategories.length; i++) {
      if (availableCategories[i].title === categoryName) {
        availableCategories[i].style.backgroundColor = "#b9b7b7";
      } else {
        availableCategories[i].style.backgroundColor = "#ffffff";
      }
    }
  };

  return (
    <div>
      <div id="popup-container">
        <div id="popup">
          {/* Click the back button will refresh habit creating screen */}
          <div
            id="back-button"
            onClick={() => {
              setCategory("Popular");
              setEmoji("📝");
              setHabitName("");
            }}
            hidden={category !== "Custom"}
          >
            <ChevronLeft size={36} />
          </div>
          <div id="close-button" onClick={handleClose}>
            ✕
          </div>
          {/* It will switch between the habit creation and selection window
                    depending on whether custom was selected or button was clicked */}
          {category !== "Custom" ? (
            <div>
              <h2 id="habit-title" style={{ fontSize: "36px", color: "black" }}>
                Select a Habit to Track:
              </h2>
              <div id="habit-layout">
                <div id="habit-types">
                  <button
                    className="habit-type"
                    title="Popular"
                    onClick={() => {
                      setCategory("Popular");
                      handleSelect("Popular");
                    }}
                  >
                    <Flame color="#FF9500" />
                  </button>
                  <button
                    className="habit-type"
                    title="Health"
                    onClick={() => {
                      setCategory("Health");
                      handleSelect("Health");
                    }}
                  >
                    <Activity color="#FF0000" />
                  </button>
                  <button
                    className="habit-type"
                    title="Exercise"
                    onClick={() => {
                      setCategory("Exercise");
                      handleSelect("Exercise");
                    }}
                  >
                    <Volleyball color="#FF8400" />
                  </button>
                  <button
                    className="habit-type"
                    title="Financial"
                    onClick={() => {
                      setCategory("Financial");
                      handleSelect("Financial");
                    }}
                  >
                    <HouseHeart color="#078319" />
                  </button>
                  <button
                    className="habit-type"
                    title="Learning"
                    onClick={() => {
                      setCategory("Learning");
                      handleSelect("Learning");
                    }}
                  >
                    <GraduationCap color="#000000" />
                  </button>
                  <button
                    className="habit-type"
                    title="Custom"
                    onClick={() => {
                      setCategory("Custom");
                      handleSelect("Custom");
                    }}
                  >
                    <Plus color="#FF0000" />
                  </button>
                </div>
                <HabitWindow
                  viewing={category}
                  onSelectCustom={() => {
                    setCategory("Custom");
                  }}
                  onSelectName={(name) => setHabitName(name)}
                  onSelectEmoji={(emoji) => setEmoji(emoji)}
                />
              </div>
            </div>
          ) : (
            <div>
              <h2 id="habit-title" style={{ fontSize: "36px", color: "black" }}>
                Create Habit:
              </h2>
              <div id="create-habit-container">
                <div id="create-habit">
                  <CreateHabitForm
                    habitName={habitName}
                    onSubmission={() => {
                      (setCategory("Popular"), handleClick());
                    }}
                    emoji={emoji}
                    setHabitName={setHabitName}
                    addHabit={addHabit}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <button id="add-btn" title="Add Habit" onClick={handleClick}>
        <CirclePlus color="black" />
      </button>
    </div>
  );
}

export default HabitCreate;
