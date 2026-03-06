import { useState, useEffect, useRef } from "react";
import { Pencil } from 'lucide-react';
import './index.css';
import './HabitDetails.css';

function NameDescription() {
    const colorInputRef = useRef(null);
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [color, setColor] = useState("#b9b7b7");
    
    return (
        <div id="habit-desc">
            <div id="habit-header">
                <div 
                id="habit-circle"
                style={{backgroundColor: color}}
                onClick={() => colorInputRef.current?.click()}
                />

                <input
                    ref={colorInputRef}
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    style={{display: "none"}}
                />

                <input 
                type="text"
                id="habit-name"
                placeholder="<Habit Name>"
                value={name}
                onChange={(e) => {setName(e.target.value)}}
                />
            </div>
            <div className="line"/>
            <textarea 
            id="description"
            onChange={(e) => {
                setDescription(e.target.value)
            }}
            placeholder={"Description"}
            value={description}
            />
        </div>
    );
}

function MilestoneSettings() {
    const [rewardEveryStreak, setRewardEveryStreak] = useState(true);
    const [rewardAfterStreakDays, setRewardAfterStreakDays] = useState(0);

    return (
        <div id="mile-settings">
            <div id="reward">
            <span> Reward after every streak? </span> <input id="reward-check" type="checkbox" checked={rewardEveryStreak}
                                                       onClick={() => {setRewardEveryStreak(!rewardEveryStreak)}}/>
            </div>
            <Line />
            <span id="reward-after-day-streaks"> 
                Reward coins after every {" "}
                <input id="number-input" type="number"/>
                {" "}day streaks 
            </span>
        </div>
    )
}

function HabitType() {
    const [habitType, setHabitType] = useState("Build");

    // Handles what happen you select what type of habit you want to create (build or quit)
    const selectType = (type) => {
        setHabitType(type);
        if(type === "Build"){
            document.getElementById("build-option").style.backgroundColor = "#5B5FB4";
            document.getElementById("build-option").style.color = "white";
            document.getElementById("quit-option").style.backgroundColor = "#b9b7b700";
            document.getElementById("quit-option").style.color = "rgba(0, 0, 0, 0.25)";

            // document.getElementById("quit-option").style.backgroundColor = "#ffffff";
        } else{
            document.getElementById("quit-option").style.backgroundColor = "#5B5FB4";
            document.getElementById("quit-option").style.color = "white";
            document.getElementById("build-option").style.backgroundColor = "#b9b7b700";
            document.getElementById("build-option").style.color = "rgba(0, 0, 0, 0.25)";
            // document.getElementById("build-option").style.backgroundColor = "#ffffff";
        }
    }
    
    return (
        <div id="habit-type">
            <button type="button" className='habit-type-option'
            id="build-option" onClick={() => selectType("Build")}>
                Build
            </button>
            <button type="button" className='habit-type-option'
            id="quit-option" onClick={() => selectType("Quit")}>
                 Quit
            </button>
        </div>
    );
}

function GoalInfo() {
    return (
        <div id="goal-info">
            <div id="goal-period"> 
                <label style={{width: "90%"}}> Goal Period: </label>
                <select name="period" id="period" 
                style={{fontSize: "18px", textAlign: "left", cursor: "pointer"}} onChange={(e) => setPeriod(e.target.value)}> 
                    <option value="Day">Daily</option>
                    <option value="Week">Weekly</option>
                    <option value="Month">Monthly</option>
                </select>
            </div>
            <Line />
            <div id="goal-value">
                <span style={{fontSize: "16px"}}> Goal Value: </span>
                <input type="number" id="value-input" name="value" min="1"/>
                <select name="unit" id="value-unit">
                    <option value="steps">steps</option>
                    <option value="gallons">gallons</option>
                    <option value="liters">liters</option>
                    <option value="pages">pages</option>
                    <option value="hours">hours</option>
                    <option value="minutes">minutes</option>
                </select>
                <div id="goal-period-text">/ Day</div>
            </div>
            <Line />
            <div id="task-days">
                <span>Task Days: </span>
                <select name = "task-day" id="task-day" style={{fontSize: "18px", textAlign: "left"}}>
                    <option value="everyday">Everyday</option>
                    <option value="specific_days">Specific days of the week</option>
                    <option value="number_days">Number of days per week</option>
                    <option value="specific_month_days">Specific days of the month</option>
                    <option value="specific_month_number">Number of days per month</option>
                </select>
            </div>
        </div>
    );
}

function ReminderSettings() {
    const [reminderCheck, setReminderCheck] = useState(true);
    const [reminderMessage, setReminderMessage] = useState("");
    return (
        <div id="reminder-settings">
            <div id="reminder-option">
                <span>Do you want to be reminded?</span>
                <input
                type="checkbox"
                id="reminder-check"
                checked={reminderCheck}
                onClick={() => setReminderCheck(!reminderCheck)}
                />
            </div>

            {/*
            <Line />
            <span> Select Time</span>
            <Line />
            <textarea 
            id="reminder-message"
            onChange={(e) => {
                setReminderMessage(e.target.value)
            }}
            placeholder={"Reminder Message"}
            value={reminderMessage}
            />
            */}
        </div>
    );
}

function Priority() {
    return (
        <div id="priority">
            <div id="set-priority">
                <span>Set Priority: </span>
                <select name="priority" id="select-priority" style={{fontSize: "18px", textAlign: "left"}}>
                    <option value="none">No Preference</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <Line />
            <br />
            <div id="habit-term">
                <div id="start-date">
                    <p style={{fontSize: "16px", textAlign: "center"}}>Start Date</p>
                    <input type="date" id="start-date-select" name="start-date-select" style={{fontSize: "18px", textAlign: "center"}}></input>
                </div>
                <div id="end-date">
                    <p style={{fontSize: "16px", textAlign: "center"}}>End Date</p>
                    <input type="date" id="end-date-select" name="end-date-select" style={{fontSize: "18px", textAlign: "center"}}></input>
                </div>
            </div>
        </div>
    );  
}

function Line() {
    return (
        <div className="line" />
    );
}

function HabitDetails({ onClose }) {

    return (
        <div id="details-frame">
                <div id="popup-header">
            <button
                id="popup-close"
                onClick={onClose}
            >
                ×
            </button>
        </div>
        <NameDescription />
        <span className="details-name"> Habit Type </span>
        <HabitType />
        <span className="details-name"> Goal Info </span>
        <GoalInfo />
        <span className="details-name"> Reminder Settings </span>
        <ReminderSettings />
        <span className="details-name"> Priority </span>
        <Priority />
    </div>
    );
}

function HabitDetailsPopup() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <div>
            
            {/* Temporary way to text popup */}
            <button onClick={() => setShowPopup(true)}
                style={{borderRadius: "50%", backgroundColor: "white"}}>
                <Pencil color='black'/>
            </button>

            {showPopup && (
                <div
                    id="habit-popup-overlay"
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        id="habit-popup"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <HabitDetails onClose={() => setShowPopup(false)}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HabitDetailsPopup;