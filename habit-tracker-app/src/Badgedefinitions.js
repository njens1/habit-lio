/*
    Badgedefinitions.js holds the badges a user can earn while checking for badge completion given a specified criteria
 */

export const BADGES = [
    {
        // streak badges
        id: "streak_3",
        name: "3 Day Streak Badge: ",
        description: "Reach a 3-day streak on any habit",
        emoji: "🔥",
        category: "streak",
    },
    {
        id: "streak_7",
        name: "7 Day Streak Badge: ",
        description: "Reach a 7-day streak on any habit",
        emoji: "✨",
        category: "streak",
    },
    {
        id: "streak_14",
        name: "14 Day Streak Badge: ",
        description: "Reach a 14-day streak on any habit",
        emoji: "⭐",
        category: "streak",
    },
    {
        id: "streak_30",
        name: "30 day Streak Badge: ",
        description: "Reach a 30-day streak on any habit",
        emoji: "🏆",
        category: "streak",
    },
    {
        id: "streak_100",
        name: "100 Day Streak Badge: ",
        description: "Reach a 100-day streak on any habit",
        emoji: "💯",
        category: "streak",
    },
    // completion badges
    {
        id: "completions_1",
        name: "First Habit Completed: ",
        description: "Complete a habit for the first time",
        emoji: "🔥",
        category: "completions",
    },
    {
        id: "completions_10",
        name: "10 Habits Completed: ",
        description: "Complete habits 10 times total",
        emoji: "✨",
        category: "completions",
    },
    {
        id: "completions_50",
        name: "50 Habits Completed: ",
        description: "Complete habits 50 times total",
        emoji: "⭐",
        category: "completions",
    },
    {
        id: "completions_100",
        name: "100 Habits Completed: ",
        description: "Complete habits 100 times total",
        emoji: "🌟",
        category: "completions",
    },
    {
        id: "completions_365",
        name: "365 Hours Completed: ",
        description: "Complete habits 365 times total",
        emoji: "🏆",
        category: "completions",
    },
    // habit creation badges
    {
        id: "habits_created_1",
        name: "First Habit: ",
        description: "Create your first habit",
        emoji: "🔥",
        category: "habits_created",
    },
    {
        id: "habits_created_3",
        name: "3 Habits Created: ",
        description: "Create 3 habits",
        emoji: "✨",
        category: "habits_created",
    },
    {
        id: "habits_created_5",
        name: "5 Habits Created: ",
        description: "Create 5 habits",
        emoji: "⭐",
        category: "habits_created",
    },
    {
        id: "habits_created_10",
        name: "10 Habits Created: ",
        description: "Create 10 habits",
        emoji: "🏆",
        category: "habits_created",
    },
    // consistency badges
    {
        id: "consistency_all_week",
        name: "One week of habit completion: ",
        description: "Complete at least one habit every day for 7 days",
        emoji: "🔥",
        category: "consistency",
    },
    {
        id: "consistency_multi_habit_day",
        name: "Three or More Habits Completed in a Day: ",
        description: "Complete 3 or more habits in a single day",
        emoji: "✨",
        category: "consistency",
    },
    {
        id: "consistency_all_active",
        name: "All Habits:",
        description: "Complete all of your active habits on the same day",
        emoji: "⭐",
        category: "consistency",
    },
];

export function checkBadges(habits = [], earnedIds = []) {
    const newlyEarned = [];

    const totalCompletions = habits.reduce((sum, h) => sum + (h.completions?.length ?? 0), 0);

    const maxStreak = Math.max(0, ...habits.map((h) => Number(h.streak) || 0));
    const habitCount = habits.length;

    const alreadyEarned = (id) => earnedIds.includes(id);

    for (const badge of BADGES) {
        if (alreadyEarned(badge.id)) continue;

        let earned = false;

        switch (badge.id) {
            case "streak_3":
                earned = maxStreak >= 3;
                break;
            case "streak_7":
                earned = maxStreak >= 7;
                break;
            case "streak_14":
                earned = maxStreak >= 14;
                break;
            case "streak_30":
                earned = maxStreak >= 30;
                break;
            case "streak_100":
                earned = maxStreak >= 100;
                break;
            case "completions_1":
                earned = totalCompletions >= 1;
                break;
            case "completions_10":
                earned = totalCompletions >= 10;
                break;
            case "completions_50":
                earned = totalCompletions >= 50;
                break;
            case "completions_100":
                earned = totalCompletions >= 100;
                break;
            case "completions_365":
                earned = totalCompletions >= 365;
                break;
            case "habits_created_1":
                earned = habitCount >= 1;
                break;
            case "habits_created_3":
                earned = habitCount >= 3;
                break;
            case "habits_created_5":
                earned = habitCount >= 5;
                break;
            case "habits_created_10":
                earned = habitCount >= 10;
                break;
            case "consistency_all_week": {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                let allDaysCovered = true;
                for (let i = 0; i < 7; i++) {
                    const d = new Date(today);
                    d.setDate(today.getDate() - i);
                    const dateStr = d.toISOString().split("T")[0];
                    const completedThatDay = habits.some((h) =>
                        h.completions?.includes(dateStr)
                    );
                    if (!completedThatDay) {
                        allDaysCovered = false;
                        break;
                    }
                }
                earned = allDaysCovered;
                break;
            }
            case "consistency_multi_habit_day": {
                const dateCounts = {};
                for (const h of habits) {
                    for (const date of h.completions ?? []) {
                        dateCounts[date] = (dateCounts[date] ?? 0) + 1;
                    }
                }
                earned = Object.values(dateCounts).some((count) => count >= 3);
                break;
            }

            case "consistency_all_active": {
                const activeHabits = habits.filter((h) => h.isActive !== false);
                if (activeHabits.length === 0) break;
                const dateSets = activeHabits.map(
                    (h) => new Set(h.completions ?? [])
                );
                const firstSet = dateSets[0];
                for (const date of firstSet) {
                    if (dateSets.every((s) => s.has(date))) {
                        earned = true;
                        break;
                    }
                }
                break;
            }

            default:
                break;
        }

        if (earned) {
            newlyEarned.push(badge);
        }
    }

    return newlyEarned;
}