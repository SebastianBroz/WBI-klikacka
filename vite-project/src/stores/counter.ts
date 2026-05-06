import { defineStore } from "pinia";

export const useCounterStore = defineStore("counter", {
    state: () => {
        return { count: 0 };
    },
    actions: {
        increment(val = 0) {
            this.count += val;
        },
    },
    getters: {
        doubleCount: (state) => state.count * 2,
    }
});