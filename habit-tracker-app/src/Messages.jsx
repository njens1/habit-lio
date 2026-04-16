/*
    Messages.jsx handles the messaging between users
 */

import { useState, useEffect, useRef } from "react";
import { Search, CircleEllipsis, SendHorizonal } from "lucide-react";
import { listFriends, getChatId, subscribeToMessages, sendMessage } from "./firestore";
import "./index.css";
import "./Messages.css";


//-- Fake data --------------------------
/*
const conversations = [
    {
        uid: 1, 
        name: "Alex Rivera", 
        username: "alexrivera",
        active: true,
        messages: [
            {
                id: 1, sender: "Alex Rivera", text: "I believe in you. You are a GOAT.", time: "2:34 PM", // 'sender' must be their name
            }, 
            {
                id: 2, sender: "me", text: "bruh", time: "2:35 PM"
            },
        ], 
        color: "#d0e8d0"
    },
    { 
        uid: 2, 
        name: "Jordan Kim", 
        username: "jordankim" ,
        active: false,
        messages: [
            { id: 1, sender: "John Doe", text: "Hello.", time: "1:10 PM" },
            { id: 2, sender: "John Doe", text: "Howdy.", time: "1:12 PM" },
        ],
        color: "#f0d8c8"
    },
    { 
        uid: 3, 
        name: "Sam Patel", 
        username: "sampatel",
        active: false,
        messages: [
            { id: 1, sender: "Jack Smith", text: "Keep going!", time: "12:00 PM" },
        ],
        color: "#e8d0f0"
    },
    { 
        uid: 4, 
        name: "Casey Morgan", 
        username: "caseymorgan",
        active: true,
        messages: [
            { id: 1, sender: "Jane Doe", text: "Do you enjoy cardio?", time: "11:45 AM" },
            { id: 2, sender: "me", text: "No", time: "11:46 AM" },
        ],
        color: "#f0e8c8"
    },
]
//---------------------------------------
*/

const Avatar = ({ user }) => (
    <div className="avatar-wrapper">
        <div
            className="avatar"
            style={{width: "35px", height: "35px", borderRadius: "50%", background: user.color}}
        >
        </div>
        { user.active && <div className="avatar-online-dot" /> }
    </div>
);

// selectedFriend for when you select a friend to message in friends page
function Messages({ uid }) {
    const [selected, setSelected] = useState(null);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const [friends, setFriends] = useState([]);
    const [activeMessages, setActiveMessages] = useState([]);
    const [options, setOptions] = useState(false);
    const messagesEndRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const loadFriends = async () => {
            if (!uid) return;
            const data = await listFriends(uid);
            setFriends(data);
            if (data.length > 0 && !selected) setSelected(data[0]);
        };
        loadFriends();
    }, [uid]);

    // Listen for live messages when a friend is selected
    useEffect(() => {
        if (!selected || !uid) return;
        const chatId = getChatId(uid, selected.uid);
        const unsubscribe = subscribeToMessages(chatId, (msgs) => {
            setActiveMessages(msgs);
        });
        return () => unsubscribe();
    }, [selected, uid]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeMessages]);

    const handleSend = async () => {
        if (!input.trim() || !selected) return;
        const chatId = getChatId(uid, selected.uid);
        await sendMessage(chatId, uid, input);
        setInput("");
    };

    const filteredFriends = friends.filter(f =>
        f.username.toLowerCase().includes(search.toLowerCase())
    );

    // Handles clicking outside of the options popup modal
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    });

    return (
        <div id="messages-wrapper">
            <h1 id="page-title">YOUR MESSAGES</h1>

            <div id="messages-frame-wrapper">

                {/* Sidebar */}
                <div id="sidebar">
                    <div id="search-wrapper">
                        <input
                            id="search-input"
                            placeholder="Search friends"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Search />
                    </div>


                    <div id="convo-list">
                        {filteredFriends.map((f) => (
                            <div key={f.uid} className={`convo-item ${selected?.uid === f.uid ? "selected" : ""}`}
                                 onClick={() => setSelected(f)}>
                                <Avatar user={f} />
                                <div className="convo-info">
                                    <div className="convo-name">@{f.username}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="chat-area">
                    {selected ? (
                        <>
                            <div id="chat-header">
                                <Avatar user={selected} />
                                <div id="chat-header-info">
                                    <div id="chat-header-name">@{selected.username}</div>
                                </div>
                            </div>
                            <div id="messages-area">
                                {activeMessages.map((msg) => {
                                    const isMe = msg.senderUid === uid;
                                    return (
                                        <div key={msg.id} className={`message-row ${isMe ? "sent" : "received"}`}>
                                            <div className={`message-bubble ${isMe ? "sent" : "received"}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>
                            <div id="messages-input-bar">
                                <input id="messages-input" value={input}
                                       onChange={(e) => setInput(e.target.value)}
                                       onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                       placeholder="Type a message" />
                                <button id="messages-input-btn" onClick={handleSend}>
                                    <SendHorizonal size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'black'}}>
                            Select a friend to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messages;