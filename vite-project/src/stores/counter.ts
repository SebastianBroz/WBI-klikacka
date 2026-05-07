import { defineStore } from "pinia";

interface Achievement {
    title: string;
    description: string;
    img: string;
}

export const useCounterStore = defineStore("counter", {
    state: () => {
        return {
            count: 0,
            achievements: [] as Achievement[],
            recentGains: [] as { time: number; amount: number }[],
        };
    },
    actions: {
        increment(val = 0) {
            this.count += val;
            if (val > 0) {
                const now = Date.now();
                this.recentGains.push({ time: now, amount: val });
                this.recentGains = this.recentGains.filter(g => now - g.time < 30000);
            }
        },
        addAchievement(achievement: Achievement) {
            const alreadyUnlocked = this.achievements.some(a => a.title === achievement.title);
            if (!alreadyUnlocked) {
                this.achievements.push(achievement);
            }
        },
        applyInsectAttack() {
            const now = Date.now();
            const recentTotal = this.recentGains
                .filter(g => now - g.time < 30000)
                .reduce((sum, g) => sum + g.amount, 0);
            const deduction = Math.floor(recentTotal * 0.3);
            this.count = Math.max(0, this.count - deduction);
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
    }
});
