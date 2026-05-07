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
        };
    },
    actions: {
        increment(val = 0) {
            const amount = val * Math.pow(3, this.fertilizerLevel);
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
            if (this.count >= this.fertilizerCost) {
                this.count -= this.fertilizerCost;
                this.fertilizerLevel++;
            }
        },
        buyPesticide() {
            if (this.count >= this.pesticideCost) {
                this.count -= this.pesticideCost;
                this.pesticideExpiry = Date.now() + 5 * 3600 * 1000;
                this.pesticideLevel++;
            }
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
        fertilizerCost: (state) => Math.floor(50 * Math.pow(50, state.fertilizerLevel)),
        pesticideCost: (state) => Math.floor(300 * Math.pow(3, state.pesticideLevel)),
    }
});
