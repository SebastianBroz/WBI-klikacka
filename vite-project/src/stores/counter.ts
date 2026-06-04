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
            newAchievements: [] as Achievement[],
            recentGains: [] as { time: number; amount: number }[],
            fertilizerLevel: 0,
            pesticideLevel: 0,
            pesticideExpiry: 0,
            bigCursorPerkOwned: false,
            perkDropActive: false,
            lastSessionTime: 0,
            endingDismissed: false,
            musicVolume: 0.2,
            effectsVolume: 0.5,
            musicMuted: false,
            effectsMuted: false,
            animationsDisabled: false,
            savedActiveEvent: null as 'rain' | 'insect_attack' | null,
            savedEventExpiry: 0,
        };
    },
    actions: {
        setMusicVolume(value: number) {
            const normalized = Math.max(0, Math.min(1, value));
            this.musicVolume = normalized;
            this.musicMuted = normalized === 0;
        },
        setEffectsVolume(value: number) {
            const normalized = Math.max(0, Math.min(1, value));
            this.effectsVolume = normalized;
            this.effectsMuted = normalized === 0;
        },
        toggleMusicMuted() {
            this.musicMuted = !this.musicMuted;
        },
        toggleEffectsMuted() {
            this.effectsMuted = !this.effectsMuted;
        },
        toggleAnimationsDisabled() {
            this.animationsDisabled = !this.animationsDisabled;
        },
        playMoneySound() {
            if (this.effectsMuted) return;
            const audio = new Audio('/audio/money-sound.mp3');
            audio.volume = this.effectsVolume;
            audio.play().catch(() => {
            });
        },
        playButtonSound() {
            if (this.effectsMuted) return;
            const audio = new Audio('/audio/button-sound.mp3');
            audio.volume = this.effectsVolume;
            audio.play().catch(() => {
            });
        },
        playWoodSound() {
            if (this.effectsMuted) return;
            const audio = new Audio('/audio/wood-sound.mp3');
            audio.volume = this.effectsVolume;
            audio.play().catch(() => {
            });
        },
        playLeavesSound() {
            if (this.effectsMuted) return;
            const audio = new Audio('/audio/leaves-sound.mp3');
            audio.volume = this.effectsVolume;
            audio.play().then(() => {
                setTimeout(() => {
                    audio.pause();
                    audio.currentTime = 0;
                }, 500);
            }).catch(() => {
            });
        },
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
                this.newAchievements.push(achievement);
                // Auto-remove after 5 seconds
                setTimeout(() => {
                    this.newAchievements = this.newAchievements.filter(a => a.title !== achievement.title);
                }, 5000);
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
                this.playMoneySound();
            }
        },
        buyPesticide() {
            const level = Number(this.pesticideLevel) || 0;
            const cost = Math.floor(300 * Math.pow(3, level));
            if (this.count >= cost) {
                this.count -= cost;
                this.pesticideExpiry = Date.now() + 5 * 3600 * 1000;
                this.pesticideLevel = level + 1;
                this.playMoneySound();
            }
        },
        dropCursorPerk() {
            this.perkDropActive = true;
        },
        collectCursorPerk() {
            this.bigCursorPerkOwned = true;
            this.perkDropActive = false;
        },
        saveGame() {
            const gameData = {
                count: this.count,
                fertilizerLevel: this.fertilizerLevel,
                pesticideLevel: this.pesticideLevel,
                pesticideExpiry: this.pesticideExpiry,
                bigCursorPerkOwned: this.bigCursorPerkOwned,
                achievements: this.achievements,
                lastSessionTime: Date.now(),
                endingDismissed: this.endingDismissed,
                savedActiveEvent: this.savedActiveEvent,
                savedEventExpiry: this.savedEventExpiry,
                musicVolume: this.musicVolume,
                effectsVolume: this.effectsVolume,
                musicMuted: this.musicMuted,
                effectsMuted: this.effectsMuted,
                animationsDisabled: this.animationsDisabled,
            };
            localStorage.setItem('wbi-klikacka-save', JSON.stringify(gameData));
        },
        loadGame() {
            const savedData = localStorage.getItem('wbi-klikacka-save');
            if (savedData) {
                try {
                    const data = JSON.parse(savedData);
                    this.count = data.count || 0;
                    this.fertilizerLevel = data.fertilizerLevel || 0;
                    this.pesticideLevel = data.pesticideLevel || 0;
                    this.pesticideExpiry = data.pesticideExpiry || 0;
                    this.bigCursorPerkOwned = data.bigCursorPerkOwned || false;
                    this.achievements = data.achievements || [];
                    this.lastSessionTime = data.lastSessionTime || 0;
                    this.endingDismissed = data.endingDismissed || false;
                    this.savedActiveEvent = data.savedActiveEvent || null;
                    this.savedEventExpiry = data.savedEventExpiry || 0;
                    this.musicVolume = data.musicVolume ?? 0.2;
                    this.effectsVolume = data.effectsVolume ?? 0.5;
                    this.musicMuted = data.musicMuted ?? false;
                    this.effectsMuted = data.effectsMuted ?? false;
                    this.animationsDisabled = data.animationsDisabled ?? false;
                } catch (e) {
                    console.error('Chyba při načítání hry:', e);
                }
            }
        },
        calculateOfflineGains(elapsedMs: number) {
            const FIELD_COUNT = 32;
            const GROWTH_TIME_NORMAL = 10000; // ms

            // Předpokládáme normální růst (bez deště) v offline čase
            const growthsCompleted = Math.floor(elapsedMs / GROWTH_TIME_NORMAL);
            const gainsPerField = 1 * Math.pow(3, this.fertilizerLevel);
            const totalGains = FIELD_COUNT * growthsCompleted * gainsPerField;

            if (totalGains > 0) {
                this.count += totalGains;
            }

            return totalGains;
        },
        resetGame() {
            // Resetuj všechny hodnoty na výchozí
            this.count = 0;
            this.achievements = [];
            this.newAchievements = [];
            this.recentGains = [];
            this.fertilizerLevel = 0;
            this.pesticideLevel = 0;
            this.pesticideExpiry = 0;
            this.bigCursorPerkOwned = false;
            this.perkDropActive = false;
            this.lastSessionTime = 0;
            this.endingDismissed = false;
            this.savedActiveEvent = null;
            this.savedEventExpiry = 0;
            this.musicVolume = 0.2;
            this.effectsVolume = 0.5;
            this.musicMuted = false;
            this.effectsMuted = false;
            this.animationsDisabled = false;

            // Vymaž všechny uložené údaje
            localStorage.removeItem('wbi-klikacka-save');
            localStorage.removeItem('wbi-klikacka-plant');
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
