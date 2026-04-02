import { useEffect, useState } from "react";
import { BADGES, checkBadges } from "./badgeDefinitions";
import { getEarnedBadges, saveEarnedBadges } from "./firestore";
import { X } from "lucide-react";
import "./Badges.css";

const CATEGORIES = [
  { key: "streak", label: "🔥 Streak" },
  { key: "completions", label: "✅ Completions" },
  { key: "habits_created", label: "🌱 Habits Created" },
  { key: "consistency", label: "🎯 Consistency" },
];

function BadgeCard({ badge, isEarned }) {
  return (
    <div
      className={`badge-card ${isEarned ? "earned" : "locked"}`}
      title={badge.description}
    >
      {isEarned && <div className="badge-earned-dot" />}

      <span>{badge.emoji}</span>
      <span className="badge-name">{badge.name}</span>
      <span className="badge-desc">{badge.description}</span>
    </div>
  );
}

function Badges({ uid, habits, onClose }) {
  const [earnedIds, setEarnedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    const load = async () => {
      try {
        const stored = await getEarnedBadges(uid);
        const freshNew = checkBadges(habits, stored);
        const freshIds = freshNew.map((b) => b.id);
        const merged = Array.from(new Set([...stored, ...freshIds]));

        if (freshIds.length > 0) {
          await saveEarnedBadges(uid, merged);
        }

        setEarnedIds(merged);
      } catch (err) {
        console.error("Failed to load badges:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [uid, habits]);

  const earnedCount = earnedIds.length;
  const totalCount = BADGES.length;

  return (
    <div className="badges-overlay" onClick={onClose}>
      <div
        className="badges-popup"
        role="dialog"
        aria-label="Badges"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="badges-close-btn" onClick={onClose} title="Close">
          <X size={24} />
        </button>

        <div className="badges-header">
          <h2 className="badges-title">🏅 Your Badges</h2>
          <div className="badges-summary">
            <div className="badges-summary-pill">
              <div className="pill-num">Total Badges Earned: {earnedCount}</div>
            </div>

            <br />

            <div className="badges-summary-pill">
              <div className="pill-num">
                Badges Yet to Complete: {totalCount - earnedCount}
              </div>
            </div>

            <br />

            <div className="badges-summary-pill">
              <div className="pill-num">
                Badges Completed:{" "}
                {totalCount > 0
                  ? Math.round((earnedCount / totalCount) * 100)
                  : 0}
                %
              </div>
            </div>
          </div>
        </div>

        <br />

        <div className="badges-body">
          {loading ? (
            <div className="badges-empty">Loading badges…</div>
          ) : (
            <>
              <div className="badges-section-title earned-title">
                Earned Badges
              </div>
              {CATEGORIES.map(({ key, label }) => {
                const earned = BADGES.filter(
                  (b) => b.category === key && earnedIds.includes(b.id),
                );
                if (earned.length === 0) return null;
                return (
                  <div key={key}>
                    <div className="badges-category-title">{label}</div>
                    <div className="badges-grid">
                      {earned.map((badge) => (
                        <BadgeCard
                          key={badge.id}
                          badge={badge}
                          isEarned={true}
                        />
                      ))}
                    </div>
                    <br />
                  </div>
                );
              })}
              {earnedCount === 0 && (
                <div className="badges-empty">
                  No badges earned yet. Keep grinding!
                </div>
              )}

              <div className="badges-divider" />

              <div className="badges-section-title locked-title">
                Badges Yet to be Earned
              </div>
              {CATEGORIES.map(({ key, label }) => {
                const locked = BADGES.filter(
                  (b) => b.category === key && !earnedIds.includes(b.id),
                );
                if (locked.length === 0) return null;
                return (
                  <div key={key}>
                    <div className="badges-category-title">{label}</div>
                    <div className="badges-grid">
                      {locked.map((badge) => (
                        <BadgeCard
                          key={badge.id}
                          badge={badge}
                          isEarned={false}
                        />
                      ))}
                    </div>
                    <br />
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Badges;
