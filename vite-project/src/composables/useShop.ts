import { computed } from 'vue'
import type { useCounterStore } from '../stores/counter'

export function useShop(store: ReturnType<typeof useCounterStore>) {
    const shopItems = computed(() => [
        {
            title: "Fertilizer",
            description: "Triples crop yield per harvest. Price multiplies by 50 each purchase.",
            img: "/placeholder.jpeg",
            cost: store.fertilizerCost,
            canAfford: store.count >= store.fertilizerCost,
            buy: () => store.buyFertilizer()
        },
        {
            title: "Pesticides",
            description: "Prevents insect attacks for 5 hours. Price multiplies by 3 each purchase.",
            img: "/placeholder.jpeg",
            cost: store.pesticideCost,
            canAfford: store.count >= store.pesticideCost,
            buy: () => store.buyPesticide()
        }
    ])

    return { shopItems }
}