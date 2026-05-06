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
        };
    },
    actions: {
        increment(val = 0) {
            this.count += val;
        },
        addAchievement(achievement: Achievement) {
            const alreadyUnlocked = this.achievements.some(a => a.title === achievement.title);
            if (!alreadyUnlocked) {
                this.achievements.push(achievement);
            }
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
    }
});