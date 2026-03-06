import { useState } from 'react';
import { Pencil } from 'lucide-react';
import '../css/habit.css'
import HabitDetailsPopup from '../HabitDetails';  


function HabitEdit({habit, uid, loadHabits}){
    return(
        <div>
            {/* <button title="Edit Habit"
            style={{borderRadius: "50%", backgroundColor: "white"}}>
                <Pencil color='black'/>
                </button> */}
            <HabitDetailsPopup habit={habit} uid={uid} loadHabits={loadHabits} />
        </div>
    );
}


export default HabitEdit;