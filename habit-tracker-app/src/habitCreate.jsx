import { useState } from 'react';
import './habit-creation.css'

import { X, Flame, Activity, Volleyball, HouseHeart, GraduationCap, Plus, ChevronLeft, CirclePlus} from 'lucide-react'

function showPopup(show) {
    const popup = document.getElementById("popup-container");
    popup.style.display = show ? "block" : "none";
}

function HabitOption({name, onAddClick}) {

    // const modifyHabit = () => {
    //     // This function will modify the habit option to show that it has been added
    //     document.getElementById("habit-name").value = {name};
    // }
    return (
        <div>
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                <div className="habit-options">
                    <div id="habit-container">
                        <p style={{fontSize: "36px", color: 'black'}}>{name}</p>
                        <button style={{borderRadius: "50%"}} className="habit-plus" onClick={() => {onAddClick(); modifyHabit();}}>
                            <Plus color="#000000"/>
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
        "Popular": "Most Popular Habits",
        "Health": "Your Medical & Wellness Goals",
        "Exercise": "Fitness & Activity",
        "Financial": "Money Management",
        "Learning": "Educational & Skill Development",
        "Custom": "Create Your Own Habit"
    };
    var categorySelected = props.viewing;
    return (
    <div>
        <div id="habit-window">
            <h1 id ="habitCategory">{categorySelected}</h1>
            <p id="category-description">{descriptions[categorySelected]}
            </p>
            <div hidden={categorySelected !== "Popular"} className="custom-habit-form">
                <HabitOption name="🚶 Walk" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🏃‍♂️ Run" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="💧 Drink Water" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🛌 Sleep" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📚 Study" onAddClick={() => props.onSelectCustom()}/>
            </div>
            <div hidden={categorySelected !== "Health"} className="custom-habit-form">
                <HabitOption name="🍽️ Eat Snack" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🪥 Brush Teeth" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="💧 Drink Water" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🛌 Sleep" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🧘 Meditate" onAddClick={() => props.onSelectCustom()}/>
            </div>
            <div hidden={categorySelected !== "Exercise"} className="custom-habit-form">
                <HabitOption name="🚶 Walk" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🏃‍♂️ Run" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🚴 Bike" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🏋️ Lift Weights" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🤸 Stretch" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🧘 Meditate" onAddClick={() => props.onSelectCustom()}/>
            </div>
            <div hidden={categorySelected !== "Financial"} className="custom-habit-form">
                <HabitOption name="💰 Save Money" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📈 Invest" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📉 Spend Less" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🧾 Pay Bills" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📝 Apply for Jobs" onAddClick={() => props.onSelectCustom()}/>
            </div>
            <div hidden={categorySelected !== "Learning"} className="custom-habit-form">
                <HabitOption name="📚 Study" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🧑‍🏫 Attend Class" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📝 Take Notes" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="📖 Read" onAddClick={() => props.onSelectCustom()}/>
                <HabitOption name="🧑‍💻 Code" onAddClick={() => props.onSelectCustom()}/>
            </div>
        </div>
    </div>
    );
}

// BACKEND FUNCTIONALITIES SHOULD BE ADDED HERE!
function CreateHabitForm() {
    const [habitType, setHabitType] = useState("Build");
    const [periodSelected, setPeriod] = useState("Day");

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
        <div>
            <form id="create-habit-form">
                {/* Initial Info */}
                <div id = "habit-form-first-row">
                    <div id="habit-circle">
                        <div id="habit-emoji" 
                        style={{backgroundColor: "#b9b7b7", width: "10em", height: "10em", 
                        borderRadius: "50%"}}>
                        </div>
                        <br />
                        <span>
                            <label>Set Color: </label>
                            <input type="color" id="emoji-color" 
                            name="emoji-color" value="#b9b7b7" />
                        </span>
                    </div>
                    <div id ="habit-info">
                        <input type="text" id="habit-name" name="habit-name" 
                        placeholder="Habit Name"/>
                        <br />
                        {/* <br /> */}
                        <textarea id="habit-description" maxlength="100"
                        name="habit-description" placeholder="Add Description"/>
                    </div>
                </div>
                <br />
                 <hr style={{color: "#000000", width: "100%"}}/>
                 {/* Habit Type */}
                <div id="habit-form-second-row">
                    <h2 style={{fontSize: "24px", textAlign: "center"}}>
                        Habit Type
                    </h2>
                    <div id="habit-type-options">
                        <button type="button" className='habit-type-option'
                        id="build-option" onClick={() => selectType("Build")}>
                            Build
                        </button>
                        <button type="button" className='habit-type-option' 
                        id="quit-option" onClick={() => selectType("Quit")}>
                            Quit
                        </button>
                    </div>
                </div>
                {/* Goal Info */}
                <hr style={{color: "#000000", width: "100%"}}/>
                <div id="habit-form-third-row">
                    <h2 style={{fontSize: "24px", textAlign: "center"}}>
                        Goal Info
                    </h2>
                    <div id="goal-period">
                        <label for="period" style={{fontSize: "18px", textAlign: "center"}}>Goal Period: </label>
                        <select name="period" id="period" 
                        style={{fontSize: "18px", textAlign: "center"}} onChange={(e) => setPeriod(e.target.value)}>
                            <option value="Day">Daily</option>
                            <option value="Week">Weekly</option>
                            <option value="Month">Monthly</option>
                        </select>
                    </div>
                    <br />
                    <div id="goal-value">
                        <label for="value" style={{fontSize: "18px", textAlign: "center"}}>Goal Value: </label>
                        <input type="number" id="value" name="value" min="1" 
                        style={{fontSize: "18px", textAlign: "center", width: "30%"}}/>
                        <select name="unit" id="unit" style={{fontSize: "18px", textAlign: "center"}}>
                            <option value="steps">steps</option>
                            <option value="gallons">gallons</option>
                            <option value="liters">liters</option>
                            <option value="pages">pages</option>
                            <option value="hours">hours</option>
                            <option value="minutes">minutes</option>
                        </select>
                        <label for="period-selected" style={{fontSize: "18px", textAlign: "center"}}> / {periodSelected} </label>
                    </div>
                    <br />
                    <div id="task-days">
                        <label style={{fontSize: "18px", textAlign: "center"}}>Task Days: </label>
                        <select name = "task-day" id="task-day" style={{fontSize: "18px", textAlign: "center"}}>
                            <option value="everyday">Everyday</option>
                            <option value="specific_days">Specific days of the week</option>
                            <option value="number_days">Number of days per week</option>
                            <option value="specific_month_days">Specific days of the month</option>
                            <option value="specific_month_number">Number of days per month</option>
                        </select>
                    </div>
                </div>
                <hr style={{color: "#000000", width: "100%"}}/>
                {/* Reminder Settings */}
                <div id="habit-form-fourth-row">
                    <h2 style={{fontSize: "24px", textAlign: "center"}}>Reminder Settings</h2>
                    <div id="reminder-options">
                        <label for="reminder-time" style={{fontSize: "18px", textAlign: "center"}}>Want to be reminded? </label>
                        <input type="checkbox" id="reminder-time" name="reminder-time" style={{fontSize: "18px"}} onChange={(e) => {
                            document.getElementById("yes-reminder").hidden = !e.target.checked;
                        }}></input>
                        <br />
                        <div id="yes-reminder" hidden={true}>
                            <label for="reminder-time" style={{fontSize: "18px", textAlign: "center"}}>Select Time: </label>
                            <input type="time" id="reminder-time" name="reminder-time" style={{fontSize: "18px", textAlign: "center"}}>
                            </input>
                            <br />
                            <br />
                            <textarea id="reminder-message" maxlength="100" placeholder='Reminder Message here' />
                        </div>
                    </div>
                </div>
                <hr style={{color: "#000000", width: "100%"}}/>
                <div id="submit-button-container">
                    <div id="priority-setting">
                        <label for="priority" style={{fontSize: "18px", textAlign: "center"}}>Set Priority: </label>
                        <select name="priority" id="priority" style={{fontSize: "18px", textAlign: "center"}}>
                            <option value="none">No Preference</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    <h2 style={{fontSize: "20px", textAlign: "center"}}>Habit Term</h2>
                    <div id="habit-term">
                        <div id="start-date">
                            <p style={{fontSize: "16px", textAlign: "center"}}>Start Date</p>
                            <input type="date" id="start-date" name="start-date" style={{fontSize: "18px", textAlign: "center"}}></input>
                        </div>
                        <div id="end-date">
                            <p style={{fontSize: "16px", textAlign: "center"}}>End Date</p>
                            <input type="date" id="end-date" name="end-date" style={{fontSize: "18px", textAlign: "center"}}>
                            </input>
                        </div>
                    </div>
                    <br />
                    <button type="submit" id="submit-button" 
                    style={{backgroundColor: "#acacac", color: "black", fontWeight: "bold"}}>Create Habit</button>
                </div>
            </form>
        </div>
    );
}



function HabitCreate() {
    const [clicked, setClicked] = useState(false);
    const [category, setCategory] = useState("Popular");

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
    }

    return (
        <div>
            <div id = "popup-container">
                <div id="popup">
                    <div id="back-button" onClick={() => setCategory("Popular")} hidden={category !== "Custom"}>
                        <ChevronLeft size={36}/>
                        </div>
                    <div id="close-button" onClick={handleClick}><X size={36}/></div>
                    {/* It will switch between the habit creation and selection window
                    depending on whether custom was selected or button was clicked */}
                    {category !== "Custom" ? (
                        <div>
                            <h2 id="habit-title" style={{fontSize: "36px", color:"black"}}>Select a Habit to Track:</h2>
                            <div id="habit-layout">
                                <div id="habit-types">
                                    <button className='habit-type' title="Popular" 
                                    onClick={() => {setCategory("Popular"); handleSelect("Popular");}}>
                                        <Flame color="#FF9500"/>
                                    </button>
                                    <button className='habit-type' title="Health" onClick={() => {setCategory("Health"); handleSelect("Health");}}>
                                        <Activity color="#FF0000"/>
                                        </button>
                                    <button className='habit-type' title="Exercise" onClick={() => {setCategory("Exercise"); handleSelect("Exercise");}}>
                                        <Volleyball color="#FF8400"/>
                                        </button>
                                    <button className='habit-type' title="Financial" onClick={() => {setCategory("Financial"); handleSelect("Financial");}}>
                                        <HouseHeart color="#078319"/>
                                        </button>
                                    <button className='habit-type' title="Learning" onClick={() => {setCategory("Learning"); handleSelect("Learning");}}>
                                        <GraduationCap color="#000000"/>
                                        </button>
                                    <button className='habit-type' title="Custom" onClick={() => {setCategory("Custom"); handleSelect("Custom");}}>
                                        <Plus color="#FF0000"/>
                                        </button>
                                </div>
                                <HabitWindow viewing={category} onSelectCustom={() => setCategory("Custom")} />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 id="habit-title" style={{fontSize: "36px", color:"black"}}>Create Habit:</h2>
                            <div id="create-habit-container">
                                <div id="create-habit">
                                    <CreateHabitForm />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button id="add-btn" onClick={handleClick}> <CirclePlus color="black" /> </button>
        </div>
    );
}

export default HabitCreate;