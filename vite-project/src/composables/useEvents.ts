import { ref, computed } from 'vue'

export type GameEvent = 'rain' | 'insect_attack' | null

export const activeEvent = ref<GameEvent>(null)
export const eventTimeRemaining = ref(0)
export const isRainActive = computed(() => activeEvent.value === 'rain')
