import { useState } from 'react';
import { Pencil } from 'lucide-react';
import '../css/habit.css'
import HabitDetailsButton from '../HabitDetails';  


function HabitEdit({habit, uid, loadHabits, onOpen }){
    return(
        <div>
            <button
                onClick={onOpen}
                style={{borderRadius: "50%", backgroundColor: "white"}}
            >
                <Pencil />
            </button>
        </div>
    );
}

export default HabitEdit;