/* Badges.jsx is the actual popup that is reflected in the habit tracker using the Badgedefinitions.js */

import { useEffect, useState } from "react";
import { BADGES, checkBadges } from "./badgeDefinitions";
import { getEarnedBadges, saveEarnedBadges, getFriends } from "./firestore";
import { Flame, CheckCircle, Sprout, Target, ChevronLeft, Lock, Handshake } from "lucide-react";
import "./Badges.css";

const CATEGORIES = [
  { key: "streak", label: "Streak", icon: <Flame color="#FF9500" /> },
  { key: "completions", label: "Completions", icon: <CheckCircle color="#FF0000" /> },
  { key: "habits_created", label: "Habits Created", icon: <Sprout color="#078319" /> },
  { key: "consistency", label: "Consistency", icon: <Target color="#5B5FB4" /> },
  { key: "friends", label: "Friends", icon: <Handshake color="#5B5FB4" /> },
];

function BadgeCard({ badge, isEarned }) {
  return (
      <div className={`badge-card-v2 ${isEarned ? "earned" : "locked"}`}>
        <div className="badge-icon-wrapper">
          <span className="badge-emoji-v2">{badge.emoji}</span>
          {!isEarned && (
              <div className="badge-lock-overlay">
                <Lock size={16} />
              </div>
          )}
        </div>
        <div className="badge-text-v2">
          <h3 className="badge-name-v2">{badge.name}</h3>
          <p className="badge-desc-v2">{badge.description}</p>
        </div>
        {isEarned && <div className="earned-ribbon">Earned</div>}
      </div>
  );
}

function Badges({ uid, habits, onClose }) {
  const [earnedIds, setEarnedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (!uid) return;
    const load = async () => {
      try {
        const [stored, currentFriends] = await Promise.all([
          getEarnedBadges(uid),
          getFriends(uid)
        ]);
        const freshNew = checkBadges(habits, stored, currentFriends);
        const freshIds = freshNew.map((b) => b.id);
        const merged = Array.from(new Set([...stored, ...freshIds]));
        if (freshIds.length > 0) await saveEarnedBadges(uid, merged);
        setEarnedIds(merged);
      } catch (err) {
        console.error("Failed to load badges:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [uid, habits]);

  const totalCount = BADGES.length;
  const earnedCount = earnedIds.length;

  return (
      <div className="badges-overlay" onClick={onClose}>
        <div className="badges-popup-v2" onClick={(e) => e.stopPropagation()}>

          <div className="badges-nav-header">
            {selectedCategory ? (
                <div className="badge-back-button" onClick={() => setSelectedCategory(null)}>
                  <ChevronLeft size={28} />
                  <span id="back-to-categories">Back to Categories</span>
                </div>
            ) : <div />}
            <button className="badges-close-btn" onClick={onClose}>✕</button>
          </div>

          <div className="badges-content">
            {loading ? (
                <div className="badges-loading">Fetching your badges...</div>
            ) : !selectedCategory ? (
                <>
                  <h1 className="view-title">🏅 Your Badges</h1>
                  <div className="badges-overall-stats">
                    <div className="badges-progress-bar">
                      <div
                          className="badges-progress-fill"
                          style={{ width: `${Math.round((earnedCount / totalCount) * 100)}%` }}
                      />
                    </div>
                    <p>{earnedCount} of {totalCount} badges unlocked</p>
                  </div>

                  <div className="badge-category-grid">
                    {CATEGORIES.map((cat) => {
                      const categoryBadges = BADGES.filter(b => b.category === cat.key);
                      const earnedInCategory = categoryBadges.filter(b => earnedIds.includes(b.id)).length;

                      return (
                          <button
                              key={cat.key}
                              className="badge-category-card"
                              onClick={() => setSelectedCategory(cat.key)}
                          >
                            <div className="cat-icon-large">{cat.icon}</div>
                            <span className="cat-label-text">{cat.label}</span>
                            <span className="cat-completion-tag">{earnedInCategory}/{categoryBadges.length}</span>
                          </button>
                      );
                    })}
                  </div>
                </>
            ) : (
                <>
                  <h1 className="view-title">
                    {CATEGORIES.find(c => c.key === selectedCategory).icon}
                    {CATEGORIES.find(c => c.key === selectedCategory).label}
                  </h1>
                  <div className="badges-grid-v2">
                    {BADGES.filter((b) => b.category === selectedCategory).map((badge) => (
                        <BadgeCard
                            key={badge.id}
                            badge={badge}
                            isEarned={earnedIds.includes(badge.id)}
                        />
                    ))}
                  </div>
                </>
            )}
          </div>
        </div>
      </div>
  );
}

export default Badges;