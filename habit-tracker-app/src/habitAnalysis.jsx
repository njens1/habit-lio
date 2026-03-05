import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, getDoc, getDocs, deleteDoc, doc, orderBy, serverTimestamp, setDoc, updateDoc, addDoc} from 'firebase/firestore'; 
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.scales.linear.ticks.stepSize = 1;
ChartJS.defaults.scales.linear.beginAtZero = true;

export default function NewHabitForm({ uid, onClose }) {
  const [totalHabits, setTotalHabits] = useState(0);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });

  const overlayStyle = { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
  const popupStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '90%', maxWidth: '600px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' };

  useEffect(() => {
    if (!uid) return;

    const fetchHabits = async () => {
      try {
        //fetch user data
        const habitsRef = collection(db, "users", uid, "habits");
        const q = query(habitsRef);
        const querySnapshot = await getDocs(q); 
        
        const habitsData = [];
        querySnapshot.forEach((doc) => {
          habitsData.push({ id: doc.id, ...doc.data() });
        });

        if (habitsData.length === 0) {
          console.log("No habits found");
          return;
        }
        setTotalHabits(habitsData.length);
      
        setBarData({         
          labels: ["Total Habits"],         
          datasets: [{           
            label: "Habit Count",           
            data: [habitsData.length],           
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgb(75, 192, 192)",
            borderWidth: 1
          }]       
        });
        
        //this currently uses fake data
        setPieData({
          labels: ['Health', 'Exercise', 'Financial', 'Learning', 'Other'],
          datasets: [{
            data: [3, 1, 2, 0, 4],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            hoverOffset: 4
          }]
        });

      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };
    fetchHabits();
  }, [uid]);


  return (     
    <div style={overlayStyle}>       
      <div style={popupStyle}>      
         
        <div style={{ position: 'relative', textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0 }}>Habit Analytics</h2>
          <button onClick={onClose} style={{ position: 'absolute', top: '-25px', right: '-25px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#666' }}>
            ✕
          </button>
        </div>      

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start', justifyItems: 'center' }}>

          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '250px' }}>
              <Bar data={barData} />
            </div>
            <p>Total: <strong>{totalHabits}</strong></p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '15px' }}>Habit Distribution</h3>
            <div style={{ height: '250px' }}>
              <Pie data={pieData} />
            </div>
          </div>

        </div>
      </div>     
    </div>   
  ); 
}