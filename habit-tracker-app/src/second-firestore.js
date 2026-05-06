/*
  second-firestore.js is used for saving affirmations in userInfo
 */

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
  addDoc,
  where,
  limit,
  arrayUnion
} from "firebase/firestore";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { db, storage } from "./firebase";

export const saveAffirmations = async (userId, affirmationsArray) => {
  // Path is only 2 segments: collection "users", document "userId"
  const userDocRef = doc(db, "users", userId);

  try {
    await updateDoc(userDocRef, {
      // Use dot notation to reach inside the 'userInfo' map field
      "userInfo.affirmations": affirmationsArray
    });
    
    console.log("Affirmations updated!");
    window.location.reload(); // Only use if you aren't updating React state
  } catch (error) {
    console.error("Error updating affirmations:", error);
  }
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

export const completeHabit = async (userId, habitId, setActive) => {
  const habitDocRef = doc(db, "users", userId, "habits", habitId);
  // const habitData = habitDocRef.data();
  const today = getTodayDate();
  const completions = habitDocRef.completions || [];

  // let updatedCompletions;

 try {
    // 1. If we are marking it as inactive (completed), add today to the list
    if (setActive === false) {
      await updateDoc(habitDocRef, {
        isActive: false,
        completions: arrayUnion(today), // Atomically adds 'today' to the array
        completedAt: serverTimestamp(),
      });
    } else {
      // 2. If marking active again, reset completions (as per your logic)
      await updateDoc(habitDocRef, {
        isActive: true,
        completions: [],
        completedAt: null, // Optional: clear completion timestamp
      });
    }
    
    console.log("Habit status updated!");
  } catch (error) {
    console.error("Error updating habit:", error);
  }
};