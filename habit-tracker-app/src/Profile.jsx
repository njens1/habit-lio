import { useEffect, useState, useRef } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import "./Profile.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

function Profile({ uid, onClose }) {
  const auth = getAuth();
  const user = auth.currentUser;

  // Profile state
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [earnedCount, setEarnedCount] = useState(0);
  const [memberSince, setMemberSince] = useState("");

  // Edit state
  const [showEdit, setShowEdit] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editPublic, setEditPublic] = useState(false);
  const [editAvatar, setEditAvatar] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Analysis state
  const [habitsData, setHabitsData] = useState([]);
  const [totalHabits, setTotalHabits] = useState(0);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);
  const [barData, setBarData] = useState({ labels: [], datasets: [] });
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [highestStreak, setHighestStreak] = useState(0);

  const fileInputRef = useRef(null);

  // Load profile
  useEffect(() => {
    if (!uid) return;
    const loadProfile = async () => {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const name = data.userInfo?.username || "";
        setDisplayName(name);
        setBio(data.bio || "");
        setIsPublic(data.isPublic || false);
        setEarnedCount((data.earnedBadges || []).length);
        if (data.profilePictureUrl) {
          setAvatar(data.profilePictureUrl);
        } else if (user?.photoURL) {
          setAvatar(user.photoURL);
        }
        if (data.createdAt) {
          const date = data.createdAt.toDate?.() || new Date(data.createdAt);
          setMemberSince(
            date.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          );
        }
      }
    };
    loadProfile();
  }, [uid]);

  // Load habits
  useEffect(() => {
    if (!uid) return;
    const fetchHabits = async () => {
      const snapshot = await getDocs(
        query(collection(db, "users", uid, "habits")),
      );
      const fetched = [];
      const years = new Set([new Date().getFullYear()]);

      snapshot.forEach((docSnap) => {
        const data = { id: docSnap.id, ...docSnap.data() };
        fetched.push(data);
        const start =
          data.startDate?.toDate?.() ||
          (data.startDate ? new Date(data.startDate) : null);
        const end =
          data.endDate?.toDate?.() ||
          (data.endDate ? new Date(data.endDate) : null);
        if (start && end && !isNaN(start) && !isNaN(end)) {
          for (let y = start.getFullYear(); y <= end.getFullYear(); y++)
            years.add(y);
        }
      });

      const streaks = fetched.map((h) => Number(h.streak) || 0);
      setHighestStreak(streaks.length > 0 ? Math.max(...streaks) : 0);
      setHabitsData(fetched);
      setTotalHabits(fetched.length);
      setAvailableYears(Array.from(years).sort((a, b) => b - a));

      const priorities = ["none", "low", "medium", "high"];
      const priorityCounts = priorities.map(
        (p) =>
          fetched.filter((h) => (h.priority || "none").toLowerCase() === p)
            .length,
      );
      setPieData({
        labels: ["None", "Low", "Medium", "High"],
        datasets: [
          {
            data: priorityCounts,
            backgroundColor: ["#8be08b", "#369de2", "#ecbd46", "#f54c71"],
          },
        ],
      });
    };
    fetchHabits();
  }, [uid]);

  // Bar chart
  useEffect(() => {
    if (habitsData.length === 0) return;
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const counts = months.map(
      (_, i) =>
        habitsData.filter((habit) => {
          const start =
            habit.startDate?.toDate?.() ||
            (habit.startDate ? new Date(habit.startDate) : null);
          const end =
            habit.endDate?.toDate?.() ||
            (habit.endDate ? new Date(habit.endDate) : null);
          if (!start || !end || isNaN(start) || isNaN(end)) return false;
          const mStart = new Date(selectedYear, i, 1);
          const mEnd = new Date(selectedYear, i + 1, 0);
          return start <= mEnd && end >= mStart;
        }).length,
    );
    setBarData({
      labels: months,
      datasets: [
        {
          label: `Active Habits (${selectedYear})`,
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgb(0,0,0)",
          borderWidth: 1,
        },
      ],
    });
  }, [habitsData, selectedYear]);

  const getHeatmapData = () => {
    const counts = {};
    habitsData.forEach((habit) => {
      (habit.completions || []).forEach((dateStr) => {
        if (dateStr.startsWith(selectedYear.toString())) {
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        }
      });
    });
    return Object.keys(counts).map((date) => ({ date, count: counts[date] }));
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 150 * 1024) {
      setSaveError("Image must be under 150KB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openEdit = () => {
    setEditName(displayName);
    setEditBio(bio);
    setEditPublic(isPublic);
    setEditAvatar(avatar);
    setSaveError("");
    setShowEdit(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const updates = {
        bio: editBio,
        isPublic: editPublic,
        "userInfo.username": editName,
      };
      if (editAvatar) {
        updates["profilePictureUrl"] = editAvatar;
      }
      await updateDoc(doc(db, "users", uid), updates);
      await updateProfile(user, { displayName: editName });
      setDisplayName(editName);
      setBio(editBio);
      setIsPublic(editPublic);
      setAvatar(editAvatar);
      setShowEdit(false);
    } catch (err) {
      setSaveError("Failed to save. Please try again." + err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose}>
          ✕
        </button>

        {showEdit ? (
          // Edit Screen
          <div className="profile-edit-screen">
            <h3>Edit Profile</h3>

            <div
              className="profile-avatar-upload"
              onClick={() => fileInputRef.current.click()}
            >
              {editAvatar ? (
                <img
                  src={editAvatar}
                  alt="avatar"
                  className="profile-avatar-large"
                />
              ) : (
                <div className="profile-avatar-placeholder large">?</div>
              )}
              <span className="profile-avatar-hint">Click to change photo</span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="profile-toggle-row">
              <span>Public Profile</span>
              <label className="profile-toggle">
                <input
                  type="checkbox"
                  checked={editPublic}
                  onChange={(e) => setEditPublic(e.target.checked)}
                />
                <span className="profile-toggle-slider" />
              </label>
            </div>

            <input
              className="profile-input"
              type="text"
              placeholder="Display name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />

            <textarea
              className="profile-input profile-textarea"
              placeholder="Bio (optional)"
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              rows={3}
            />

            {saveError && <p className="profile-error">{saveError}</p>}

            <div className="profile-edit-buttons">
              <button onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          // ── Read-only View ──
          <>
            <div className="profile-header">
              {avatar ? (
                <img src={avatar} alt="avatar" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-placeholder">?</div>
              )}
              <div className="profile-info">
                <h2 className="profile-name">{displayName || "No name set"}</h2>
                {bio && <p className="profile-bio">{bio}</p>}
                <p className="profile-meta">Member since {memberSince}</p>
                {isPublic && (
                  <span className="profile-public-tag">
                    🌐 Profile is Public
                  </span>
                )}
              </div>
              <button className="profile-edit-btn" onClick={openEdit}>
                Edit
              </button>
            </div>

            <div className="profile-stats-row">
              <div className="profile-stat">
                <span className="profile-stat-num">🔥 {highestStreak}</span>
                <span className="profile-stat-label">Longest Streak</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">{totalHabits}</span>
                <span className="profile-stat-label">Lifetime Habits</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">🏅 {earnedCount}</span>
                <span className="profile-stat-label">Badges</span>
              </div>
            </div>

            <div className="profile-analysis">
              <div className="profile-section">
                <div className="profile-section-header">
                  <h3>Active Habits</h3>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                  >
                    {availableYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ height: "180px" }}>
                  <Bar
                    data={barData}
                    options={{
                      maintainAspectRatio: false,
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 } },
                      },
                    }}
                  />
                </div>
              </div>

              <div className="profile-section">
                <h3>Consistency Map ({selectedYear})</h3>
                <div className="heatmap-container">
                  <CalendarHeatmap
                    startDate={new Date(`${selectedYear}-01-01`)}
                    endDate={new Date(`${selectedYear}-12-31`)}
                    values={getHeatmapData()}
                    classForValue={(value) => {
                      if (!value || value.count === 0) return "color-empty";
                      return `color-scale-${Math.min(value.count, 4)}`;
                    }}
                    titleForValue={(value) =>
                      value
                        ? `${value.count} habits completed on ${value.date}`
                        : "No habits completed"
                    }
                  />
                </div>
              </div>

              <div className="profile-section" style={{ textAlign: "center" }}>
                <h3>Priority Distribution</h3>
                <div
                  style={{
                    height: "220px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Pie
                    data={pieData}
                    options={{ maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
