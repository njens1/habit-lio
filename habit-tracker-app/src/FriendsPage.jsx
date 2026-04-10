/*
  FriendsPage.jsx manages social networking
 */

import {useEffect, useState} from "react";
import {
  UserPlus,
  Search,
  UserCheck,
  UserX,
  MessageCircle,
} from "lucide-react";
import "./index.css";
import "./FriendsPage.css";
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
      <div id="friend-picture"></div>
      <div>
        {/* <div className="friend-card-name">{friend.name}</div> */}
        <div className="friend-card-username">@{friend.username}</div>
      </div>
    </div>
  </button>
);

// -- Friends List/Search -------------------------------------------------------------
const FriendsList = ({ onFriendClick, onRequestsClick, requestCount, friends }) => {
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
                    {/* <div className="search-dropdown-name">{user.name}</div> */}
                    <div className="search-dropdown-picture"></div>
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
              <div id="request-card-picture"></div>
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

// -- UserProfileModal ------------------------------------------------------------------------

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
}) => (
  <div id="profile-modal-overlay" onClick={onClose}>
    <div id="profile-modal" onClick={(e) => e.stopPropagation()}>
      <button id="profile-modal-close" onClick={onClose}>
        ✕
      </button>

      <div id="profile-modal-picture"></div>

      {/* <div id="profile-modal-name">{user.name}</div> */}
      <div id="profile-modal-username">@{user.username}</div>

      <div id="profile-modal-actions">
        {isFriend ? ( // Clicking on a friended user
          <div style={{ display: "flex", gap: "10px", flexDirection: "row" }}>
            <button
              className="profile-btn profile-btn-remove"
              onClick={() => {
                onRemoveFriend(user.uid);
              }}
            >
              <UserX /> Remove Friend
            </button>

            <button className="profile-btn profile-btn-message">
              <MessageCircle />
              Message
            </button>
          </div>
        ) : hasRequest ? ( // Clicking on a user that sent a friend request to you
          <div style={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <button
              className="profile-btn profile-btn-add"
              onClick={() => {
                onAccept(user.uid);
              }}
            >
              <UserPlus /> Accept Request
            </button>

            <button
              className="profile-btn profile-btn-remove"
              onClick={() => {
                onDecline(user.uid);
              }}
            >
              <UserX /> Decline Request
            </button>
          </div>
        ) : (
          // Clicking on a user that is not your friend or has not sent a friend request
          <div>
            <button
              className="profile-btn profile-btn-add"
              disabled={requestSent || isSendingRequest}
              onClick={() => {
                sendRequest(user.uid);
              }}
            >
              <UserPlus />
              {requestSent ? "Request Sent" : isSendingRequest ? "Sending..." : "Add Friend"}
            </button>
          </div>
        )}
      </div>

      {/* Add habit analytics here */}
    </div>
  </div>
);

function FriendsPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [friendList, setFriendsList] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [sendingRequestUid, setSendingRequestUid] = useState(null);

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
      if (selectedUser?.uid === friendUid) {
        setSelectedUser(null);
      }
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
