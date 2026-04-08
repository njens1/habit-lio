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