<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { selectedPlant } from '../composables/usePlant'
import { isRainActive } from '../composables/useEvents'
import { useCounterStore } from "../stores/counter.ts"
import SingleCollectible from './SingleCollectible.vue';
import { bigClickSignal, triggerBigClick, BIG_CLICK_RADIUS } from '../composables/useBigClick'

interface Collectible { id: number; x: number; y: number; flashing: boolean }
interface FloatNumber { id: number; value: number }
interface PerkDrop { x: number; y: number; flashing: boolean }

const store = useCounterStore();
const fieldEl = ref<HTMLElement | null>(null);
const progress = ref(0);
const collectibles = ref<Collectible[]>([]);
const floatingNumbers = ref<FloatNumber[]>([]);
const perkDrop = ref<PerkDrop | null>(null);
const isBouncing = ref(false);
let nextId = 0;
let floatId = 0;
const collectibleTimers = new Map<number, ReturnType<typeof setTimeout>[]>();
let perkFlashTimer: ReturnType<typeof setTimeout> | null = null;
let perkRemoveTimer: ReturnType<typeof setTimeout> | null = null;

const PERK_DROP_CHANCE = import.meta.env.DEV ? 1.0 : 0.005;

const growthStage = computed(() => {
  if (progress.value < 33) return 'sapling'
  if (progress.value < 66) return 'middle'
  return 'grown'
})

let gameInterval: ReturnType<typeof setInterval> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

const spawnFloat = (value: number) => {
  const id = floatId++
  floatingNumbers.value.push({ id, value })
  setTimeout(() => {
    const idx = floatingNumbers.value.findIndex(f => f.id === id)
    if (idx !== -1) floatingNumbers.value.splice(idx, 1)
  }, 1200)
}

const startTimer = () => {
  const duration = isRainActive.value ? 5000 : 10000
  const progressStep = isRainActive.value ? 0.2 : 0.1
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(() => {
    const gain = 1 * store.fertilizerMultiplier
    store.increment(1)
    spawnFloat(gain)
    progress.value = 0
    startTimer()
  }, duration)

  progress.value = 0
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = setInterval(() => {
    progress.value += progressStep
  }, 10)
}

watch(isRainActive, () => startTimer())

const removeCollectible = (id: number) => {
  const idx = collectibles.value.findIndex(c => c.id === id)
  if (idx !== -1) collectibles.value.splice(idx, 1)
  const timers = collectibleTimers.get(id)
  if (timers) { timers.forEach(clearTimeout); collectibleTimers.delete(id) }
}

const collectibleDrop = () => {
  const chance = Math.trunc(Math.random() * 100)
  if (chance < 100) // mělo by být 5 místo 100
  {
    const id = nextId++
    collectibles.value.push({ id, x: 10 + Math.random() * 70, y: 10 + Math.random() * 70, flashing: false })
    const flashTimer = setTimeout(() => {
      const c = collectibles.value.find(c => c.id === id)
      if (c) c.flashing = true
    }, 10000)
    const removeTimer = setTimeout(() => removeCollectible(id), 15000)
    collectibleTimers.set(id, [flashTimer, removeTimer])
  }
}

const onCollect = (id: number) => {
  const gain = 30 * store.fertilizerMultiplier
  store.increment(30)
  spawnFloat(gain)
  removeCollectible(id)
}

const removePerkDrop = () => {
  perkDrop.value = null
  store.perkDropActive = false
  if (perkFlashTimer) { clearTimeout(perkFlashTimer); perkFlashTimer = null }
  if (perkRemoveTimer) { clearTimeout(perkRemoveTimer); perkRemoveTimer = null }
}

const tryPerkDrop = () => {
  if (store.bigCursorPerkOwned || store.perkDropActive) return
  if (Math.random() >= PERK_DROP_CHANCE) return
  store.dropCursorPerk()
  perkDrop.value = { x: 10 + Math.random() * 70, y: 10 + Math.random() * 70, flashing: false }
  perkFlashTimer = setTimeout(() => {
    if (perkDrop.value) perkDrop.value.flashing = true
  }, 10000)
  perkRemoveTimer = setTimeout(() => removePerkDrop(), 15000)
}

const onCollectPerk = () => {
  store.collectCursorPerk()
  perkDrop.value = null
  if (perkFlashTimer) { clearTimeout(perkFlashTimer); perkFlashTimer = null }
  if (perkRemoveTimer) { clearTimeout(perkRemoveTimer); perkRemoveTimer = null }
}

const doFieldTick = () => {
  store.increment(1)
  spawnFloat(1 * store.fertilizerMultiplier)
  startTimer()
  collectibleDrop()
  tryPerkDrop()
}

const handleClick = () => {
  doFieldTick()
  isBouncing.value = true
  setTimeout(() => isBouncing.value = false, 500)
  if (store.bigCursorPerkOwned && fieldEl.value) {
    triggerBigClick(fieldEl.value)
  }
}

watch(bigClickSignal, (signal) => {
  if (!signal || !fieldEl.value || signal.sourceEl === fieldEl.value) return
  const myRect = fieldEl.value.getBoundingClientRect()
  const srcRect = signal.sourceEl.getBoundingClientRect()
  const myCX = myRect.left + myRect.width / 2
  const myCY = myRect.top + myRect.height / 2
  const srcCX = srcRect.left + srcRect.width / 2
  const srcCY = srcRect.top + srcRect.height / 2
  if (Math.hypot(myCX - srcCX, myCY - srcCY) < BIG_CLICK_RADIUS) {
    doFieldTick()
  }
})

onMounted(() => startTimer())
onUnmounted(() => {
  if (gameInterval) clearInterval(gameInterval)
  if (progressInterval) clearInterval(progressInterval)
  collectibleTimers.forEach(timers => timers.forEach(clearTimeout))
  if (perkFlashTimer) clearTimeout(perkFlashTimer)
  if (perkRemoveTimer) clearTimeout(perkRemoveTimer)
})
</script>

<template>
  <SingleCollectible
    v-for="c in collectibles"
    :key="c.id"
    :x="c.x"
    :y="c.y"
    :flashing="c.flashing"
    @collect="onCollect(c.id)"
  />
  <SingleCollectible
    v-if="perkDrop"
    :x="perkDrop.x"
    :y="perkDrop.y"
    :flashing="perkDrop.flashing"
    img="/pics/perk_rainstorm.png"
    @collect="onCollectPerk()"
  />
  <div class="field" ref="fieldEl" @click="handleClick()">
    <div
      v-for="f in floatingNumbers"
      :key="f.id"
      class="floatNumber"
    >+{{ Math.round(f.value) }}</div>
    <img v-if="selectedPlant === 'trees' && growthStage === 'sapling'" src="/pics/tree_sapling.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'trees' && growthStage === 'middle'"  src="/pics/tree_middle.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'trees' && growthStage === 'grown'"   src="/pics/tree_grown.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'sapling'" src="/pics/mushroom_sapling.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'middle'"  src="/pics/mushroom_middle.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'grown'"   src="/pics/mushroom_grown.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'sapling'" src="/pics/potato_sapling.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'middle'"  src="/pics/potato_middle.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'grown'"   src="/pics/potato_grown.png" :class="{ bouncing: isBouncing }" style="pointer-events: none;">
    <div class="timeBar" :style="{ '--width': progress }"></div>
  </div>
</template>

<style scoped>
.field {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.field img {
  height: 4rem;
  width: 4rem;
}
.floatNumber {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translateX(-50%);
  color: #2aff2a;
  font-size: 1rem;
  font-weight: bold;
  pointer-events: none;
  white-space: nowrap;
  text-shadow: 0 0 4px rgba(0, 0, 0, 0.9);
  animation: floatUp 1.2s ease-out forwards;
  z-index: 10;
}
@keyframes floatUp {
  0%   { opacity: 1;   transform: translateX(-50%) translateY(0); }
  100% { opacity: 0;   transform: translateX(-50%) translateY(-2.5rem); }
}
.bouncing {
  animation: bounce 0.5s ease;
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}
.timeBar
{
  width: 80%;
  height: 0.5rem;
  border: 2px solid #e0d0c1;
  background-color: #f7f9f9;
  border-radius: 0.25rem;
}
.timeBar::before
{
  content: '';
  width: 100%;
  height: 0.25rem;
  border: 2px solid #1aff00;
  border-radius: 0.25rem;
  display: flex;
  min-width: 1px;
  max-width: calc(var(--width, 0) * 1%);
}
</style>
