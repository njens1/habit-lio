/*
  FriendsPage.jsx manages social networking
 */

import { useEffect, useState } from "react";
import {
  UserPlus,
  Search,
  UserCheck,
  UserX,
  MessageCircle,
} from "lucide-react";
import "./index.css";
import "./FriendsPage.css";
import "./Profile.css";
import {
  searchUsers,
  createFriendRequest,
  listIncomingRequests,
  listOutgoingRequests,
  listFriends,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} from "./firestore";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
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

const MONTHS = [
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

const FriendCard = ({ friend, onClick }) => (
  <button className="friend-card" onClick={() => onClick(friend)}>
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "10px",
        justifyContent: "left",
        alignItems: "center",
      }}
    >
      <div className="friend-picture">
        {friend.profilePictureUrl ? (
          <img src={friend.profilePictureUrl} />
        ) : (
          <div className="friend-picture-placeholder">?</div>
        )}
      </div>
      <div>
        <div className="friend-card-username">@{friend.username}</div>
      </div>
    </div>
  </button>
);

// -- Friends List/Search -------------------------------------------------------------
const FriendsList = ({
  onFriendClick,
  onRequestsClick,
  requestCount,
  friends,
}) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const hasInput = search.trim().length > 0;

  useEffect(() => {
    const fetchUsers = async () => {
      if (hasInput) {
        try {
          const results = await searchUsers(search);
          setSearchResults(results);
        } catch (err) {
          console.error("Search error:", err);
        }
      } else {
        setSearchResults([]);
      }
    };
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [search, hasInput]);

  return (
    <div id="friends-page">
      <div id="search-bar-wrapper">
        <div id="search-bar">
          <button id="search-bar-requests-btn" onClick={onRequestsClick}>
            <UserPlus />
            {requestCount > 0 && (
              <span id="search-bar-requests-count">{requestCount}</span>
            )}
          </button>

          <input
            id="search-bar-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search to add friends!"
          />

          <span id="search-bar-icon">
            <Search />
          </span>
        </div>

        {hasInput && (
          <div id="search-dropdown">
            {searchResults.length > 0 ? (
              searchResults.map((user) => (
                <button
                  key={user.uid}
                  className="search-dropdown-item"
                  onClick={() => {
                    onFriendClick(user);
                    setSearch("");
                  }}
                >
                  <div className="search-dropdown-info">
                    <div className="search-dropdown-picture">
                      {user.profilePictureUrl ? (
                        <img src={user.profilePictureUrl} />
                      ) : (
                        <div className="search-dropdown-picture-placeholder">
                          ?
                        </div>
                      )}
                    </div>
                    <div className="search-dropdown-username">
                      @{user.username}
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div id="search-dropdown-empty">No users found</div>
            )}
          </div>
        )}
      </div>

      <div id="friends-grid">
        {friends.map((friend) => (
          <FriendCard
            key={friend.uid}
            friend={friend}
            onClick={onFriendClick}
          />
        ))}
      </div>
    </div>
  );
};

// -- FriendRequestsModal -------------------------------------------------------------
const FriendRequestsModal = ({
  requests,
  onClose,
  onUserClick,
  onAccept,
  onDecline,
}) => (
  <div id="requests-modal-overlay" onClick={onClose}>
    <div id="requests-modal" onClick={(e) => e.stopPropagation()}>
      <div id="requests-modal-header">
        <span id="requests-modal-title">Friend Requests</span>
        <button id="requests-modal-close" onClick={onClose}>
          ✕
        </button>
      </div>

      <div id="requests-grid">
        {requests.map((req) => (
          <button
            key={req.uid}
            className="request-card"
            onClick={() => onUserClick(req)}
          >
            <div id="request-card-wrapper">
              <div id="request-card-picture">
                {req.profilePictureUrl ? (
                  <img src={req.profilePictureUrl} />
                ) : (
                  <div id="request-card-picture-placeholder">?</div>
                )}
              </div>
              <div id="request-card-username">@{req.username}</div>
            </div>

            <div id="request-card-actions">
              <button
                id="request-card-accept"
                onClick={(e) => {
                  e.stopPropagation();
                  onAccept(req.uid);
                }}
              >
                <UserCheck />
              </button>
              <button
                id="request-card-decline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDecline(req.uid);
                }}
              >
                <UserX />
              </button>
            </div>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// -- UserProfileModal ---------------------------------------------------------------
const UserProfileModal = ({
  user,
  isFriend,
  hasRequest,
  requestSent,
  isSendingRequest,
  sendRequest,
  onClose,
  onAccept,
  onDecline,
  onRemoveFriend,
  stats,
  habitsData,
  statsLoading,
}) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([
    new Date().getFullYear(),
  ]);

  useEffect(() => {
    if (!habitsData?.length) return;
    const years = new Set([new Date().getFullYear()]);
    habitsData.forEach((h) => {
      const start =
        h.startDate?.toDate?.() || (h.startDate ? new Date(h.startDate) : null);
      const end =
        h.endDate?.toDate?.() || (h.endDate ? new Date(h.endDate) : null);
      if (start && end && !isNaN(start) && !isNaN(end)) {
        for (let y = start.getFullYear(); y <= end.getFullYear(); y++)
          years.add(y);
      }
    });
    setAvailableYears(Array.from(years).sort((a, b) => b - a));
  }, [habitsData]);

  const getBarData = () => {
    if (!habitsData?.length) return { labels: MONTHS, datasets: [] };
    const counts = MONTHS.map(
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
    return {
      labels: MONTHS,
      datasets: [
        {
          label: `Active Habits (${selectedYear})`,
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgb(0,0,0)",
          borderWidth: 1,
        },
      ],
    };
  };

  const getPieData = () => {
    if (!habitsData?.length) return { labels: [], datasets: [] };
    const priorities = ["none", "low", "medium", "high"];
    const counts = priorities.map(
      (p) =>
        habitsData.filter((h) => (h.priority || "none").toLowerCase() === p)
          .length,
    );
    return {
      labels: ["None", "Low", "Medium", "High"],
      datasets: [
        {
          data: counts,
          backgroundColor: ["#8be08b", "#369de2", "#ecbd46", "#f54c71"],
        },
      ],
    };
  };

  const getHeatmapData = () => {
    if (!habitsData?.length) return [];
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

  const renderActionButton = () => {
    if (isFriend) {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="profile-btn profile-btn-remove"
            onClick={() => onRemoveFriend(user.uid)}
          >
            <UserX size={14} /> Remove
          </button>
          <button className="profile-btn profile-btn-message">
            <MessageCircle size={14} /> Message
          </button>
        </div>
      );
    }
    if (hasRequest) {
      return (
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="profile-btn profile-btn-add"
            onClick={() => onAccept(user.uid)}
          >
            <UserCheck size={14} /> Accept
          </button>
          <button
            className="profile-btn profile-btn-remove"
            onClick={() => onDecline(user.uid)}
          >
            <UserX size={14} /> Decline
          </button>
        </div>
      );
    }
    return (
      <button
        className="profile-btn profile-btn-add"
        disabled={requestSent || isSendingRequest}
        onClick={() => sendRequest(user.uid)}
      >
        <UserPlus size={14} />
        {requestSent
          ? "Request Sent"
          : isSendingRequest
            ? "Sending..."
            : "Add Friend"}
      </button>
    );
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-popup" onClick={(e) => e.stopPropagation()}>
        <button className="profile-close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="profile-header">
          {user.profilePictureUrl ? (
            <img src={user.profilePictureUrl} className="profile-avatar" />
          ) : (
            <div className="profile-avatar-placeholder">?</div>
          )}
          <div className="profile-info">
            <h2 className="profile-name">@{user.username}</h2>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            {stats && (
              <p className="profile-meta">Member since {stats.memberSince}</p>
            )}
            <div className="profile-actions-row">{renderActionButton()}</div>
          </div>
        </div>

        {/* Stats row */}
        {statsLoading ? (
          <p style={{ textAlign: "center", color: "#aaa" }}>Loading stats...</p>
        ) : stats ? (
          <>
            <div className="profile-stats-row">
              <div className="profile-stat">
                <span className="profile-stat-num">
                  🔥 {stats.highestStreak}
                </span>
                <span className="profile-stat-label">Longest Streak</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">{stats.totalHabits}</span>
                <span className="profile-stat-label">Lifetime Habits</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">🏅 {stats.earnedCount}</span>
                <span className="profile-stat-label">Badges</span>
              </div>
              <div className="profile-stat">
                <span className="profile-stat-num">👥 {stats.friendCount}</span>
                <span className="profile-stat-label">Friends</span>
              </div>
            </div>

            {/* Charts for friends only */}
            {isFriend && habitsData?.length > 0 && (
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
                      data={getBarData()}
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

                <div
                  className="profile-section"
                  style={{ textAlign: "center" }}
                >
                  <h3>Priority Distribution</h3>
                  <div
                    style={{
                      height: "220px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Pie
                      data={getPieData()}
                      options={{ maintainAspectRatio: false }}
                    />
                  </div>
                </div>
              </div>
            )}

            {isFriend && habitsData?.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: "13px",
                  marginTop: "12px",
                }}
              >
                This user has no habits yet.
              </p>
            )}

            {!isFriend && (
              <p
                style={{
                  textAlign: "center",
                  color: "#aaa",
                  fontSize: "12px",
                  marginTop: "8px",
                }}
              >
                🔒 Add as a friend to see full habit analysis
              </p>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};

// -- FriendsPage -------------------------------------------------------------------
function FriendsPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [friendList, setFriendsList] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [sendingRequestUid, setSendingRequestUid] = useState(null);

  // Selected user's fetched data
  const [selectedUserStats, setSelectedUserStats] = useState(null);
  const [selectedUserHabits, setSelectedUserHabits] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  const refreshFriendsData = async () => {
    try {
      const [friendsData, incomingData, outgoingData] = await Promise.all([
        listFriends(),
        listIncomingRequests(),
        listOutgoingRequests(),
      ]);
      setFriendsList(friendsData);
      setRequests(incomingData);
      setOutgoingRequests(outgoingData);
    } catch (error) {
      console.error("Failed to load friends data:", error);
    }
  };

  useEffect(() => {
    refreshFriendsData();
  }, []);

  // Fetch selected user's stats whenever they change
  useEffect(() => {
    if (!selectedUser?.uid) {
      setSelectedUserStats(null);
      setSelectedUserHabits([]);
      return;
    }

    const fetchUserStats = async () => {
      setStatsLoading(true);
      setSelectedUserStats(null);
      setSelectedUserHabits([]);

      try {
        const uid = selectedUser.uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        if (!userDoc.exists()) return;

        const data = userDoc.data();

        const friendsRef = collection(db, "users", uid, "friends");
        const friendSnapshot = await getCountFromServer(friendsRef);

        let memberSince = "";
        if (data.createdAt) {
          const date = data.createdAt.toDate?.() || new Date(data.createdAt);
          memberSince = date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          });
        }

        setSelectedUserStats({
          memberSince,
          earnedCount: (data.earnedBadges || []).length,
          highestStreak: 0, // will be updated after habits load
          totalHabits: 0, // will be updated after habits load
          friendCount: friendSnapshot.data().count,
        });

        // Always fetch habits for streak/count. Only use full data for charts if friended
        const habitsSnap = await getDocs(
          query(collection(db, "users", uid, "habits")),
        );
        const habits = habitsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const streaks = habits.map((h) => Number(h.streak) || 0);

        setSelectedUserStats((prev) => ({
          ...prev,
          highestStreak: streaks.length > 0 ? Math.max(...streaks) : 0,
          totalHabits: habits.length,
        }));

        // Only store full habits data if they're a friend for charts
        const isCurrentlyFriend = friendList.some((f) => f.uid === uid);
        if (isCurrentlyFriend) {
          setSelectedUserHabits(habits);
        }
      } catch (err) {
        console.error("Failed to fetch user stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, [selectedUser?.uid, friendList]);

  const isFriend = (uid) => friendList.some((f) => f.uid === uid);
  const incomingRequestForUser = (uid) => requests.find((r) => r.uid === uid);
  const hasRequest = (uid) => Boolean(incomingRequestForUser(uid));
  const requestSent = (uid) => outgoingRequests.some((r) => r.uid === uid);

  const handleSendRequest = async (recipientUser) => {
    if (!recipientUser?.uid) return;
    try {
      setSendingRequestUid(recipientUser.uid);
      await createFriendRequest(recipientUser.uid);
      await refreshFriendsData();
    } catch (error) {
      console.error("Failed to send friend request:", error);
    } finally {
      setSendingRequestUid(null);
    }
  };

  const handleAcceptRequest = async (requesterUid) => {
    const requestItem = incomingRequestForUser(requesterUid);
    if (!requestItem?.requestId) return;
    try {
      await acceptFriendRequest(requestItem.requestId);
      await refreshFriendsData();
    } catch (error) {
      console.error("Failed to accept friend request:", error);
    }
  };

  const handleDeclineRequest = async (requesterUid) => {
    const requestItem = incomingRequestForUser(requesterUid);
    if (!requestItem?.requestId) return;
    try {
      await declineFriendRequest(requestItem.requestId);
      await refreshFriendsData();
    } catch (error) {
      console.error("Failed to decline friend request:", error);
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    if (!friendUid) return;
    try {
      await removeFriend(friendUid);
      await refreshFriendsData();
      if (selectedUser?.uid === friendUid) setSelectedUser(null);
    } catch (error) {
      console.error("Failed to remove friend:", error);
    }
  };

  return (
    <div style={{ minWidth: "75vh" }}>
      <FriendsList
        onFriendClick={setSelectedUser}
        onRequestsClick={() => setShowRequests(true)}
        requestCount={requests.length}
        friends={friendList}
      />

      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          isFriend={isFriend(selectedUser.uid)}
          hasRequest={hasRequest(selectedUser.uid)}
          requestSent={requestSent(selectedUser.uid)}
          isSendingRequest={sendingRequestUid === selectedUser.uid}
          onClose={() => setSelectedUser(null)}
          sendRequest={() => handleSendRequest(selectedUser)}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
          onRemoveFriend={handleRemoveFriend}
          stats={selectedUserStats}
          habitsData={selectedUserHabits}
          statsLoading={statsLoading}
        />
      )}

      {showRequests && (
        <FriendRequestsModal
          requests={requests}
          onClose={() => setShowRequests(false)}
          onUserClick={setSelectedUser}
          onAccept={handleAcceptRequest}
          onDecline={handleDeclineRequest}
        />
      )}
    </div>
  );
}

export default FriendsPage;
