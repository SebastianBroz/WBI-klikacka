import { watch } from 'vue'
import { selectedPlant } from './usePlant'
import type { useCounterStore } from '../stores/counter'

export const endingAchievements: Record<string, { title: string; description: string; img: string }> = {
    trees: {
        title: 'Forest Ending',
        description: 'You filled the planet with trees and saved humanity from extinction!',
        img: '/pics/achievement_forest_ending.png',
    },
    mushrooms: {
        title: 'Zombie Ending',
        description: 'The mycelium consumed all life on Earth. All intelligent life ceased to exist.',
        img: '/pics/achievement_mushroom_ending.png',
    },
    potatoes: {
        title: 'Potato Ending',
        description: 'You ended world hunger and buried the planet in potatoes. Congrats, I guess.',
        img: '/pics/achievement_potato_ending.png',
    },
};

export const cropMilestoneAchievements: Record<string, { title: string; description: string; img: string }> = {
    trees: {
        title: 'Arboreal Giant',
        description: 'Harvested 10,000 trees. The forest is flourishing!',
        img: '/pics/achievement_trees_10000.png',
    },
    mushrooms: {
        title: 'Mycelium Master',
        description: 'Harvested 10,000 mushrooms. The fungal empire grows strong!',
        img: '/pics/achievement_mushrooms_10000.png',
    },
    potatoes: {
        title: 'Potato Tycoon',
        description: 'Harvested 10,000 potatoes. You are the king of tubers!',
        img: '/pics/achievement_potatoes_10000.png',
    },
};

export const pesticideMilestoneAchievement = {
    title: 'Bug Killing Professional',
    description: 'Purchased pesticides five times. Your crops are well defended!',
    img: '/pics/achievement_pesticide_5.png',
};

export const pesticideInvestorAchievement = {
    title: 'Long Term Investor',
    description: 'Purchased pesticides fifteen times. You are investing heavily in crop protection!',
    img: '/pics/achievement_pesticide_15.png',
};

export const fertilizerMilestoneAchievement = {
    title: 'Getting Ready For Take Off!',
    description: 'Purchased fertilizers three times. Your yields are multiplying exponentially!',
    img: '/pics/achievement_fertilizer_3.png',
};

export const fertilizerMasterAchievement = {
    title: 'TO THE MOON!',
    description: 'Purchased fertilizers ten times. Your crops are supercharged!',
    img: '/pics/achievement_fertilizer_10.png',
};

export function setupAchievementWatchers(store: ReturnType<typeof useCounterStore>) {
    watch(() => store.count, (count) => {
        if (count >= 1000000000) {
            const achievement = endingAchievements[selectedPlant.value];
            if (achievement) {
                store.addAchievement(achievement);
            }
        }
        if (count >= 10000) {
            const milestoneAchievement = cropMilestoneAchievements[selectedPlant.value];
            if (milestoneAchievement) {
                store.addAchievement(milestoneAchievement);
            }
        }
    });

    watch(() => store.pesticideLevel, (level) => {
        if (level >= 5) {
            store.addAchievement(pesticideMilestoneAchievement);
        }
        if (level >= 15) {
            store.addAchievement(pesticideInvestorAchievement);
        }
    });

    watch(() => store.fertilizerLevel, (level) => {
        if (level >= 3) {
            store.addAchievement(fertilizerMilestoneAchievement);
        }
        if (level >= 10) {
            store.addAchievement(fertilizerMasterAchievement);
        }
    });
}