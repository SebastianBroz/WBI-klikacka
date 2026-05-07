import { ref } from 'vue'

interface BigClickSignal {
    id: number
    sourceEl: HTMLElement
}

const bigClickSignal = ref<BigClickSignal | null>(null)
let signalId = 0

export const BIG_CLICK_RADIUS = 250 // px — how far from the clicked field counts as a hit

export const triggerBigClick = (sourceEl: HTMLElement) => {
    bigClickSignal.value = { id: signalId++, sourceEl }
}

export { bigClickSignal }
