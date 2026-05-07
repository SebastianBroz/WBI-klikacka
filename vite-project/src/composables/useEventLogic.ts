import { ref, computed } from 'vue'
import type { useCounterStore } from '../stores/counter'
import { activeEvent, eventTimeRemaining } from './useEvents'

const DAY_DURATION = 1  // seconds
const RAIN_DURATION = 30   // seconds
const INSECT_DISPLAY = 30   // seconds (deduction is instant, display lingers)

let dayTimer: ReturnType<typeof setTimeout> | null = null
let eventTimer: ReturnType<typeof setTimeout> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null

export function setupEventLogic(store: ReturnType<typeof useCounterStore>) {
    const startCountdown = (seconds: number) => {
        eventTimeRemaining.value = seconds
        if (countdownInterval) clearInterval(countdownInterval)
        countdownInterval = setInterval(() => {
            eventTimeRemaining.value--
            if (eventTimeRemaining.value <= 0) {
                activeEvent.value = null
                store.savedActiveEvent = null
                store.savedEventExpiry = 0
                clearInterval(countdownInterval!)
            }
        }, 1000)
    }

    const restoreEvent = () => {
        if (!store.savedActiveEvent) return
        const remaining = Math.ceil((store.savedEventExpiry - Date.now()) / 1000)
        if (remaining <= 0) {
            store.savedActiveEvent = null
            store.savedEventExpiry = 0
            return
        }
        activeEvent.value = store.savedActiveEvent
        startCountdown(remaining)
    }

    const scheduleDayEvents = () => {
        if (Math.random() < 0.5) {
            const delay = Math.floor(Math.random() * DAY_DURATION * 1000)
            const type = Math.random() < 0.5 ? 'rain' : 'insect_attack'
            eventTimer = setTimeout(() => {
                if (activeEvent.value !== null) return
                if (type === 'insect_attack' && Date.now() < store.pesticideExpiry) return
                if (type === 'insect_attack') store.applyInsectAttack()
                const duration = type === 'rain' ? RAIN_DURATION : INSECT_DISPLAY
                activeEvent.value = type
                store.savedActiveEvent = type
                store.savedEventExpiry = Date.now() + duration * 1000
                startCountdown(duration)
            }, delay)
        }
        dayTimer = setTimeout(() => scheduleDayEvents(), DAY_DURATION * 1000)
    }

    const countdownDisplay = computed(() => {
        const s = eventTimeRemaining.value
        return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
    })

    const pesticideTick = ref(Date.now())
    const pesticideTimeRemaining = computed(() => {
        const remaining = store.pesticideExpiry - pesticideTick.value
        if (remaining <= 0) return null
        const s = Math.ceil(remaining / 1000)
        const h = Math.floor(s / 3600)
        const m = Math.floor((s % 3600) / 60)
        const sec = s % 60
        return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
    })

    let pesticideInterval: ReturnType<typeof setInterval> | null = null

    const startPesticideTimer = () => {
        pesticideInterval = setInterval(() => { pesticideTick.value = Date.now() }, 1000)
    }

    const stopPesticideTimer = () => {
        if (pesticideInterval) clearInterval(pesticideInterval)
    }

    return { restoreEvent, scheduleDayEvents, countdownDisplay, pesticideTimeRemaining, startPesticideTimer, stopPesticideTimer }
}

export function cleanupEventLogic() {
    if (dayTimer) clearTimeout(dayTimer)
    if (eventTimer) clearTimeout(eventTimer)
    if (countdownInterval) clearInterval(countdownInterval)
}