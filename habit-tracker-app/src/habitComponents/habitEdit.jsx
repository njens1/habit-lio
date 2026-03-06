import { useState } from 'react';
import { Pencil } from 'lucide-react';
import '../css/habit.css'
import HabitDetailsPopup from '../HabitDetails';  


function HabitEdit(){
    return(
        <div>
            {/* <button title="Edit Habit"
            style={{borderRadius: "50%", backgroundColor: "white"}}>
                <Pencil color='black'/>
                </button> */}
            <HabitDetailsPopup />
        </div>
    );
}


export default HabitEdit;