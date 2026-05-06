<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { selectedPlant } from '../composables/usePlant'
import { useCounterStore } from "../stores/counter.ts"
import SingleCollectible from './SingleCollectible.vue';

const store = useCounterStore();
const progress = ref(0);
const dropped = ref(false);
const collectX = ref(50);
const collectY = ref(50);

const growthStage = computed(() => {
  if (progress.value < 33) return 'sapling'
  if (progress.value < 66) return 'middle'
  return 'grown'
})

let gameInterval: ReturnType<typeof setInterval> | null = null;
let progressInterval: ReturnType<typeof setInterval> | null = null;

const startTimer = () => {
  if (gameInterval) clearInterval(gameInterval)
  gameInterval = setInterval(() => {
    store.increment(1)
    progress.value = 0
    startTimer()
  }, 10000)

  progress.value = 0
  if (progressInterval) clearInterval(progressInterval)
  progressInterval = setInterval(() => {
    progress.value += 0.1
  }, 10)
}

const collectibleDrop = () => {
  const chance = Math.trunc(Math.random() * 100)
  if (chance < 5) {
    collectX.value = 10 + Math.random() * 70;
    collectY.value = 10 + Math.random() * 70;
    dropped.value = true;
  }
}

const onCollect = () => {
  store.increment(30)
  dropped.value = false;
}

const handleClick = () => {
  store.increment(1)
  startTimer()
  collectibleDrop()
}

onMounted(() => startTimer())
onUnmounted(() => {
  if (gameInterval) clearInterval(gameInterval)
  if (progressInterval) clearInterval(progressInterval)
})
</script>

<template>
  <Teleport to="#fields-area">
    <SingleCollectible v-if="dropped" @collect="onCollect" :x="collectX" :y="collectY" />
  </Teleport>
  <div class="field" @click="handleClick()">
    <img v-if="selectedPlant === 'trees' && growthStage === 'sapling'" src="/pics/tree_sapling.png"  style="pointer-events: none;">
    <img v-if="selectedPlant === 'trees' && growthStage === 'middle'"  src="/pics/tree_middle.png"   style="pointer-events: none;">
    <img v-if="selectedPlant === 'trees' && growthStage === 'grown'"   src="/pics/tree_grown.png"    style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'sapling'" src="/pics/mushroom_sapling.png" style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'middle'"  src="/pics/mushroom_middle.png"  style="pointer-events: none;">
    <img v-if="selectedPlant === 'mushrooms' && growthStage === 'grown'"   src="/pics/mushroom_grown.png"   style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'sapling'" src="/pics/potato_sapling.png" style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'middle'"  src="/pics/potato_middle.png"  style="pointer-events: none;">
    <img v-if="selectedPlant === 'potatoes' && growthStage === 'grown'"   src="/pics/potato_grown.png"   style="pointer-events: none;">
    <div class="timeBar" :style="{ '--width': progress }"></div>
  </div>
</template>

<style scoped>
.field {
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
