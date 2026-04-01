import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, query, onSnapshot, getDoc, getDocs, deleteDoc, doc, orderBy, serverTimestamp, setDoc, updateDoc, addDoc} from 'firebase/firestore'; 
import { Bar, Pie } from 'react-chartjs-2';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);
ChartJS.defaults.scales.linear.ticks.stepSize = 1;
ChartJS.defaults.scales.linear.beginAtZero = true;

export default function NewHabitForm({ uid, onClose }) {
  const [habitsData, setHabitsData] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([new Date().getFullYear()]);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [highestStreak, setHighestStreak] = useState(0);
  
  const overlayStyle = { 
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  };

  const popupStyle = { 
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '700px',
    maxHeight: '85vh',
    overflowY: 'auto',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    position: 'relative'
  };

  useEffect(() => { //this is for fetching firestore data and setting it
    if (!uid) return;
    const fetchHabits = async () => {
      try {
        const habitsRef = collection(db, "users", uid, "habits");
        const querySnapshot = await getDocs(query(habitsRef));
        const fetched = [];
        const years = new Set([new Date().getFullYear()]);

        querySnapshot.forEach((doc) => {
          const data = doc.id ? { id: doc.id, ...doc.data() } : doc.data();
          fetched.push(data);
          
          const start = data.startDate?.toDate?.() || new Date(data.startDate);
          const end = data.endDate?.toDate?.() || new Date(data.endDate);
          if (start && end) {
            const startYear = start.getFullYear();
            const endYear = end.getFullYear();
            for (let y = startYear; y <= endYear; y++) {
              years.add(y);
            }
          }
        });
        
        const streaks = fetched.map(h => Number(h.streak) || 0);
        setHighestStreak(streaks.length > 0 ? Math.max(...streaks) : 0);
        setHabitsData(fetched);
        setTotalHabits(fetched.length);
        setAvailableYears(Array.from(years).sort((a, b) => b - a));

       const priorities = ['none', 'low', 'medium', 'high'];
        const priorityCounts = priorities.map(p => 
          fetched.filter(h => (h.priority || 'none').toLowerCase() === p).length
        );

        setPieData({
          labels: ['None', 'Low', 'Medium', 'High'],
          datasets: [{
            data: priorityCounts,
            backgroundColor: ['#8be08b', '#369de2', '#ecbd46', '#f54c71'],
          }]
        });
      } catch (error) { console.error("Error:", error); }
    };
    fetchHabits();
  }, [uid]);

  useEffect(() => { //this is for changing the year you are looking at
    if (habitsData.length === 0) return;

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const counts = months.map((_, index) => {
      return habitsData.filter(habit => {
        const start = habit.startDate?.toDate?.() || new Date(habit.startDate);
        const end = habit.endDate?.toDate?.() || new Date(habit.endDate);
        const mStart = new Date(selectedYear, index, 1);
        const mEnd = new Date(selectedYear, index + 1, 0);
        return start <= mEnd && end >= mStart;
      }).length;
    });

    setBarData({
      labels: months,
      datasets: [{
        label: `Active Habits (${selectedYear})`,
        data: counts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 1
      }]
    });
  }, [habitsData, selectedYear]);


  const getHeatmapData = () => {
    const counts = {};
    habitsData.forEach(habit => {
      const completions = habit.completions || [];
      completions.forEach(dateStr => {
        if (dateStr.startsWith(selectedYear.toString())) {
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      });
    });

    return Object.keys(counts).map(date => ({
      date: date,
      count: counts[date]
    }));
  };

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>

        <div style={{ position: 'sticky', top: '-30px', backgroundColor: 'white', padding: '10px 0', zIndex: 10, borderBottom: '1px solid #eee', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, textAlign: 'center' }}>Habit Analytics</h2>
          <button onClick={onClose} style={{ position: 'absolute', right: '-25px', top: '-10px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✕</button>
        </div>

        {/*Bar Chart*/}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div>
              <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Lifetime Habits</p>
              <strong style={{ fontSize: '24px' }}>{totalHabits}</strong>
            </div>
            <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} style={{ padding: '8px', borderRadius: '5px' }}>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div style={{ height: '200px' }}>
            <Bar data={barData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }} />
          </div>
        </div>

        {/*Highest Streak*/}
        <div style={{ borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px', border: '2px solid black' }}>
          <div><p style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Current Highest Streak</p></div>
          <div style={{ textAlign: 'right' }}><span style={{ fontSize: '42px', fontWeight: 'bold' }}>🔥{highestStreak}</span></div>
        </div>

        {/*Yearly Completion Map*/}
        <div style={{ marginBottom: '40px', padding: '10px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px' }}>Consistency Map ({selectedYear})</h3>
          <div className="heatmap-container">
            <CalendarHeatmap
              startDate={new Date(`${selectedYear}-01-01`)}
              endDate={new Date(`${selectedYear}-12-31`)}
              values={getHeatmapData()}

              classForValue={(value) => {
                if (!value || value.count === 0) return 'color-empty';
                return `color-scale-${Math.min(value.count, 4)}`;
              }}

              titleForValue={(value) => {
                if (!value) return `No habits completed`;
                return `${value.count} habits completed on ${value.date}`;
              }}
            />
          </div>
        </div>

        {/*Pie Chart*/}
        <div style={{ borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '20px' }}>Priority Distribution</h3>
          <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div style={{ height: '20px' }}></div>
      </div>
    </div>
  );
}