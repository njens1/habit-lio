import { getAuth, deleteUser, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./Settings.css";

function SettingsPopup({ closePopup }) {
  const auth = getAuth();
  const db = getFirestore();

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user signed in");

      // Force token refresh
      await user.getIdToken(true);

      const uid = user.uid;
      const userDocRef = doc(db, "users", uid);

      // Delete habits subcollection explicitly
      const habitsSnapshot = await getDocs(
        collection(db, "users", uid, "habits"),
      );
      for (const docSnap of habitsSnapshot.docs) {
        await deleteDoc(docSnap.ref);
      }

      // Delete main user document
      await deleteDoc(userDocRef);

      // Delete Auth user
      await deleteUser(user);

      alert("Your account and all associated data have been deleted.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting account:", error);

      if (error.code === "auth/requires-recent-login") {
        alert(
          "Please sign out and sign in again before deleting your account.",
        );
      } else {
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="settings-popup-overlay" onClick={closePopup}>
      <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
        <h2>Settings</h2>

        <button
          onClick={async () => {
            await signOut(auth);
            closePopup();
          }}
        >
          Sign Out
        </button>

        <button className="delete-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>

        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );
}

export default SettingsPopup;
