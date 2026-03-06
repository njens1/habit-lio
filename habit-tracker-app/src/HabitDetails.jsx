import { useState, useEffect, useRef } from "react";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import { Pencil } from 'lucide-react';
import './index.css';
import './HabitDetails.css';
import {handleSaveHabit, deleteHabit} from "./firestore";

function NameDescription({ habit, updateHabitField }) {
    const colorInputRef = useRef(null);

    return (
        <div id="habit-desc">
            <div id="habit-header">
                <div
                    id="habit-circle"
                    style={{ backgroundColor: habit.color ?? "#b9b7b7" }}
                    onClick={() => colorInputRef.current?.click()}
                />

                <input
                    ref={colorInputRef}
                    type="color"
                    value={habit.color ?? "#b9b7b7"}
                    onChange={(e) => updateHabitField("color", e.target.value)}
                    style={{ display: "none" }}
                />

                <input
                    type="text"
                    id="habit-name"
                    placeholder="<Habit Name>"
                    value={habit.name ?? ""}
                    onChange={(e) => updateHabitField("name", e.target.value)}
                />
            </div>

            <div className="line" />

            <textarea
                id="description"
                placeholder="Description"
                value={habit.description ?? ""}
                onChange={(e) => updateHabitField("description", e.target.value)}
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

function HabitType({ habit, updateHabitField }) {
    const habitType = habit.type ?? "Build";

    return (
        <div id="habit-type">
            <button
                type="button"
                className="habit-type-option"
                id="build-option"
                onClick={() => updateHabitField("type", "Build")}
                style={{
                    backgroundColor: habitType === "Build" ? "#5B5FB4" : "#b9b7b700",
                    color: habitType === "Build" ? "white" : "rgba(0, 0, 0, 0.25)"
                }}
            >
                Build
            </button>

            <button
                type="button"
                className="habit-type-option"
                id="quit-option"
                onClick={() => updateHabitField("type", "Quit")}
                style={{
                    backgroundColor: habitType === "Quit" ? "#5B5FB4" : "#b9b7b700",
                    color: habitType === "Quit" ? "white" : "rgba(0, 0, 0, 0.25)"
                }}
            >
                Quit
            </button>
        </div>
    );
}

function GoalInfo({ habit, updateGoalField }) {
    return (
        <div id="goal-info">
            <div id="goal-period">
                <label style={{ width: "90%" }}>Goal Period:</label>
                <select
                    name="period"
                    id="period"
                    style={{ fontSize: "18px", textAlign: "left", cursor: "pointer" }}
                    value={habit.goal?.period ?? "Day"}
                    onChange={(e) => updateGoalField("period", e.target.value)}
                >
                    <option value="Day">Daily</option>
                    <option value="Week">Weekly</option>
                    <option value="Month">Monthly</option>
                </select>
            </div>

            <Line />

            <div id="goal-value">
                <span style={{ fontSize: "16px" }}>Goal Value:</span>

                <input
                    type="number"
                    id="value-input"
                    name="value"
                    min="1"
                    value={habit.goal?.value ?? 1}
                    onChange={(e) => updateGoalField("value", Number(e.target.value))}
                />

                <select
                    name="unit"
                    id="value-unit"
                    value={habit.goal?.unit ?? "steps"}
                    onChange={(e) => updateGoalField("unit", e.target.value)}
                >
                    <option value="steps">steps</option>
                    <option value="gallons">gallons</option>
                    <option value="liters">liters</option>
                    <option value="pages">pages</option>
                    <option value="hours">hours</option>
                    <option value="minutes">minutes</option>
                </select>

                <div id="goal-period-text">/ {habit.goal?.period ?? "Day"}</div>
            </div>

            <Line />

            <div id="task-days">
                <span>Task Days:</span>
                <select
                    name="task-day"
                    id="task-day"
                    style={{ fontSize: "18px", textAlign: "left" }}
                    value={habit.taskDays ?? "everyday"}
                    onChange={(e) => updateGoalField("taskDays", e.target.value)}
                >
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

function ReminderSettings({ habit, updateHabitField }) {
    return (
        <div id="reminder-settings">
            <div id="reminder-option">
                <span>Do you want to be reminded?</span>
                <input
                    type="checkbox"
                    id="reminder-check"
                    checked={habit.reminderEnabled ?? true}
                    onChange={(e) => updateHabitField("reminderEnabled", e.target.checked)}
                />
            </div>
        </div>
    );
}

function Priority({ habit, updateHabitField }) {
    return (
        <div id="priority">
            <div id="set-priority">
                <span>Set Priority:</span>
                <select
                    name="priority"
                    id="select-priority"
                    style={{ fontSize: "18px", textAlign: "left" }}
                    value={habit.priority ?? "none"}
                    onChange={(e) => updateHabitField("priority", e.target.value)}
                >
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
                    <p style={{ fontSize: "16px", textAlign: "center" }}>Start Date</p>
                    <input
                        type="date"
                        id="start-date-select"
                        name="start-date-select"
                        value={habit.startDate ?? ""}
                        onChange={(e) => updateHabitField("startDate", e.target.value)}
                        style={{ fontSize: "18px", textAlign: "center" }}
                    />
                </div>

                <div id="end-date">
                    <p style={{ fontSize: "16px", textAlign: "center" }}>End Date</p>
                    <input
                        type="date"
                        id="end-date-select"
                        name="end-date-select"
                        value={habit.endDate ?? ""}
                        onChange={(e) => updateHabitField("endDate", e.target.value)}
                        style={{ fontSize: "18px", textAlign: "center" }}
                    />
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

function HabitDetails({ habit, uid, onClose, loadHabits }) {
    const user  = useContext(AuthContext);
    const [editedHabit, setEditedHabit] = useState(habit);
    console.log("AuthContext user:", user);

    // console.log("handleSaveHabit uid:", uid);
    // console.log("handleSaveHabit updatedHabit:", editedHabit);
    // console.log("handleSaveHabit updatedHabit.id:", editedHabit?.id);

    useEffect(() => {
        setEditedHabit(habit);
    }, [habit]);

    function updateHabitField(field, value) {
        setEditedHabit(prev => ({
            ...prev,
            [field]: value
        }));
    }

    function updateGoalField(field, value) {
        setEditedHabit(prev => ({
            ...prev,
            goal: {
                ...prev.goal,
                [field]: value
            }
        }));
    }

    async function handleSave() {
        try {
            await handleSaveHabit(user, editedHabit);
            onClose();
            if (loadHabits) {
                await loadHabits(user.uid);
            }
        } catch (error) {
            console.error("Failed to save habit changes:", error);
        }
    }

    async function handleDelete() {
        // Implement delete functionality here, similar to handleSave but calling a delete function from firestore.js
        try {
            await deleteHabit(user.uid, editedHabit.id);
            onClose();
            if (loadHabits) {
                await loadHabits(user.uid);
            }
        } catch (error) {
            console.error("Failed to delete habit:", error);
        }
    }

    return (
        <div id="details-frame">
            <div id="popup-header">
                <button id="popup-close" onClick={onClose}>×</button>
            </div>

            <NameDescription
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <span className="details-name">Habit Type</span>
            <HabitType
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <span className="details-name">Goal Info</span>
            <GoalInfo
                habit={editedHabit}
                updateGoalField={updateGoalField}
            />

            <span className="details-name">Reminder Settings</span>
            <ReminderSettings
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <span className="details-name">Priority</span>
            <Priority
                habit={editedHabit}
                updateHabitField={updateHabitField}
            />

            <button id="save-btn" onClick={handleSave}>
                Save Changes
            </button>
            <br />
            <button id="delete-btn" 
            style={{backgroundColor: "red", color: "white"}}
            onClick={handleDelete}>Delete</button>
        </div>
    );
}

function HabitDetailsPopup({habit, uid, loadHabits}) {
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
                        <HabitDetails habit={habit} 
                        uid={uid} loadHabits={loadHabits} onClose={() => setShowPopup(false)}/>
                    </div>
                </div>
            )}
        </div>
    );
}

export default HabitDetailsPopup;