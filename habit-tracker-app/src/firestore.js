import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  addDoc
} from "firebase/firestore";

import { db } from "./firebase";

export const createUserProfile = async (uid, { email, displayName }) => {
  const userRef = doc(db, "users", uid);
  await setDoc(
    userRef,
    {
      email: email || null,
      displayName: displayName || null,
      createdAt: serverTimestamp()
    },
    { merge: true }
  );

  return userRef;
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const createHabit = async (uid, habit) => {
  const habitsRef = collection(db, "users", uid, "habits");
  const habitDoc = {
    name: habit.name,
    description: habit.description || "",
    color: habit.color || "#000000",
    type: habit.type || "General",
    goal: habit.goal || { value: 1, unit: "minute" },
    taskDays: habit.taskDays || "Everyday",
    isActive: habit.isActive ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = await addDoc(habitsRef, habitDoc);
  return docRef;
};

export const listHabits = async (uid) => {
  const habitsRef = collection(db, "users", uid, "habits");
  const habitsQuery = query(habitsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(habitsQuery);

  return snapshot.docs.map((docItem) => ({
    id: docItem.id,
    ...docItem.data()
  }));
};

export const updateHabit = async (uid, habitId, updates) => {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  await updateDoc(habitRef, {
    ...updates,
    updatedAt: serverTimestamp()
  });
};

export const deleteHabit = async (uid, habitId) => {
  const habitRef = doc(db, "users", uid, "habits", habitId);
  await deleteDoc(habitRef);
};


export const exportHabits = async (uid) => {
  const habitsRef = collection(db, "users", uid, "habits");
  
  try {
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

    const headers = Object.keys(habitsData[0]);
    const csvRows = [];
    csvRows.push(headers.join(',')); // make headers row

    for (const row of habitsData) {
      const values = headers.map(header => {
        let val = row[header];

        // checks if the value is a firestore timestamp object
        if (val && typeof val.toDate === 'function') {
          const date = val.toDate();
      
          //this is for formating the data to match the date format that firestore uses
          val = new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZoneName: 'shortOffset' // this is for the "UTC-6" part of the date
          }).format(date).replace(',', ' at'); 
        }

        // cleans up any quotes or whitespaces in data
        const stringVal = val === null || val === undefined ? "" : String(val);
        const escaped = stringVal.replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }
    const csvString = csvRows.join('\n');
    
    //DOWNLOAD TRIGGERED HERE
    downloadCSV(csvString, 'habits.csv');
    console.log("Habits exported successfully!");

  } catch (error) {
    console.error("Error exporting habits:", error);
  }

};

export const downloadCSV = async(csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}