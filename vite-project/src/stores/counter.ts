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
            fertilizerLevel: 0,
            pesticideLevel: 0,
            pesticideExpiry: 0,
            bigCursorPerkOwned: false,
            perkDropActive: false,
        };
    },
    actions: {
        increment(val = 0) {
            const level = Number(this.fertilizerLevel) || 0;
            const amount = val * Math.pow(3, level);
            this.count += amount;
            if (amount > 0) {
                const now = Date.now();
                this.recentGains.push({ time: now, amount });
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
            this.count = Math.max(0, this.count - Math.floor(recentTotal * 0.3));
        },
        buyFertilizer() {
            const level = Number(this.fertilizerLevel) || 0;
            const cost = Math.floor(50 * Math.pow(50, level));
            if (this.count >= cost) {
                this.count -= cost;
                this.fertilizerLevel = level + 1;
            }
        },
        buyPesticide() {
            const level = Number(this.pesticideLevel) || 0;
            const cost = Math.floor(300 * Math.pow(3, level));
            if (this.count >= cost) {
                this.count -= cost;
                this.pesticideExpiry = Date.now() + 5 * 3600 * 1000;
                this.pesticideLevel = level + 1;
            }
        },
        dropCursorPerk() {
            this.perkDropActive = true;
        },
        collectCursorPerk() {
            this.bigCursorPerkOwned = true;
            this.perkDropActive = false;
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
        fertilizerCost: (state) => {
            const level = Number(state.fertilizerLevel) || 0;
            return Math.floor(50 * Math.pow(50, level));
        },
        fertilizerMultiplier: (state) => {
            const level = Number(state.fertilizerLevel) || 0;
            return Math.pow(3, level);
        },
        pesticideCost: (state) => {
            const level = Number(state.pesticideLevel) || 0;
            return Math.floor(300 * Math.pow(3, level));
        },
    }
});
