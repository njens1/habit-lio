/*
    Messages.jsx handles the messaging between users
 */

import { useState, useEffect, useRef } from "react";
import { Search, CircleEllipsis, SendHorizonal } from "lucide-react";
import "./index.css";
import "./Messages.css";


//-- Fake data --------------------------
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
function Messages({ selectedFriend = conversations[0]}) {
    const [selected, setSelected] = useState(selectedFriend);
    const [search, setSearch] = useState("");
    const [input, setInput] = useState("");
    const [allConvos, setAllConvos] = useState(conversations);
    const [options, setOptions] = useState(false);

    const dropdownRef = useRef(null);

    const filtered = allConvos.filter((c) => 
        c.username.toLowerCase().includes(search.toLowerCase())
    );

    // Send message backend here
    const sendMessage = () => {
        pass;
    };

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
                        {filtered.map((c) => (
                            <div 
                                key={c.uid}
                                className="convo-item"
                                onClick={() => setSelected(c)}
                            >
                                <Avatar 
                                    user={c}
                                />
                                <div className="convo-info">
                                    <div className="convo-name">@{c.username}</div>
                                    <div className="convo-preview">
                                        {allConvos.find((x) => x.uid === c.uid)?.preview}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div id="chat-area">
                    <div id="chat-header">
                        <Avatar user={selected} />
                        <div id="chat-header-info">
                            <div id="chat-header-name">@{selected.username}</div>
                            <div id="chat-header-status" className={ selected?.active ? "active" : "inactive" }>{ selected?.active ? "Active now" : "Inactive" }</div>
                        </div>
                        <div ref={dropdownRef} style={{position: "relative"}}>
                            <button id="chat-header-options" onClick={() => setOptions(!options)}><CircleEllipsis size={24} /></button>
                            {options && (
                                <div id="options-dropdown">
                                    <button className="options-item" onClick={() => {
                                        // remove friend logic here
                                        setOptions(false);
                                    }}>
                                        Remove Friend
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div id="messages-area">
                    {selected?.messages.map((msg) => {
                        const isMe = msg.sender.toLowerCase() === "me";
                        return (
                            <div key={msg.id} className={`message-row${isMe ? " sent" : " received"}`}>
                                {!isMe && <Avatar user={selected} />}
                                <div className={`message-bubble${isMe ? " sent" : " received"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Message Input */}
                <div id="messages-input-bar">
                    <input
                        id="messages-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
                        placeholder="Type a message"
                    />
                    <button id="messages-input-btn" onClick={sendMessage}>
                        <SendHorizonal size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}


export default Messages;