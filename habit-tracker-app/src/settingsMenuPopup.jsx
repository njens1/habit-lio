import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  getAuth,
  deleteUser,
  signOut,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { exportHabits } from "./firestore";
import "./Settings.css";

function SettingsPopup({ closePopup }) {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  const [showPasswordScreen, setShowPasswordScreen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const hasPassword = user?.providerData.some(
    (p) => p.providerId === "password",
  );

  const handleChangePassword = async () => {
    setPasswordError("");
    setPasswordSuccess("");

    if (!newPassword) return setPasswordError("Please enter a new password.");

    try {
      if (!user) throw new Error("No user signed in");

      // Reauthenticate if changing existing password
      if (hasPassword) {
        if (!currentPassword)
          return setPasswordError("Enter current password.");
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword,
        );
        await reauthenticateWithCredential(user, credential);
      } else if (user.providerData.some((p) => p.providerId === "google.com")) {
        // Google account
        const token = await new Promise((resolve, reject) => {
          chrome.identity.getAuthToken({ interactive: true }, (token) => {
            if (chrome.runtime.lastError || !token)
              reject(chrome.runtime.lastError);
            else resolve(token);
          });
        });
        const credential = GoogleAuthProvider.credential(null, token);
        await reauthenticateWithCredential(user, credential);
      }

      await updatePassword(user, newPassword);

      // Show success message instead of alert
      setPasswordSuccess("Password updated successfully!");
      setNewPassword("");
      setCurrentPassword("");
    } catch (err) {
      console.error("Password update error:", err);
      if (err.code === "auth/weak-password") {
        setPasswordError("Password should be at least 6 characters.");
      } else if (err.code === "auth/requires-recent-login") {
        setPasswordError(
          "Please sign out and sign in again before changing your password.",
        );
      } else if (err.code === "auth/invalid-credential") {
        setPasswordError("Current password incorrect. Please try again.");
      } else {
        setPasswordError("Failed to update password. " + err.code);
      }
    }
  };

  const handleExportHabits = async () => {
    if (!user) return;
    try {
      await exportHabits(user.uid);
    } catch (err) {
      console.error("Error exporting habits:", err);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your account? This cannot be undone.",
    );

    if (!confirmDelete) return;

    try {
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
    } catch (err) {
      console.error("Error deleting account:", err);

      if (err.code === "auth/requires-recent-login") {
        alert(
          "Failed to delete account. Please sign out and sign in again before deleting your account.",
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

        {showPasswordScreen ? (
          <div className="password-change-screen">
            <h3>{hasPassword ? "Change Password" : "Add Password"}</h3>

            {passwordError && (
              <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>
            )}
            {passwordSuccess && (
              <p style={{ color: "green", fontSize: "12px" }}>
                {passwordSuccess}
              </p>
            )}

            {hasPassword && (
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="toggle-password-btn"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            )}

            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="password-buttons">
              <button onClick={handleChangePassword}>Save</button>
              <button
                onClick={() => {
                  setShowPasswordScreen(false);
                  setPasswordError("");
                  setPasswordSuccess("");
                  setCurrentPassword("");
                  setNewPassword("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <button onClick={handleExportHabits}>Export Habits to CSV</button>

            <button onClick={() => setShowPasswordScreen(true)}>
              {hasPassword ? "Change Password" : "Add Password"}
            </button>

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
          </>
        )}
      </div>
    </div>
  );
}

export default SettingsPopup;
