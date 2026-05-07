<script setup lang="ts">
import { ref } from 'vue';
import { selectedPlant } from '../composables/usePlant'

const props = defineProps<{
  title: string,
  description: string,
  img: string,
  cost: number,
  canAfford: boolean,
}>();

const emit = defineEmits<{ buy: [] }>();

const buying = ref(false);
const particles = ref<{ id: number; angle: number }[]>([]);
let particleId = 0;

const handleBuy = () => {
  if (!props.canAfford || buying.value) return;

  const count = 8;
  for (let i = 0; i < count; i++) {
    const id = particleId++;
    particles.value.push({ id, angle: (360 / count) * i });
    setTimeout(() => {
      const idx = particles.value.findIndex(p => p.id === id);
      if (idx !== -1) particles.value.splice(idx, 1);
    }, 650);
  }

  buying.value = true;
  setTimeout(() => { buying.value = false; }, 700);

  emit('buy');
};
</script>

<template>
  <li class="offer" :class="{ buying }">
    <img :src="props.img">
    <div class="offerDesc">
      <p>{{ title }}</p>
      <p>{{ description }}</p>
      <div
        class="purchaseBtn"
        :class="{ disabled: !canAfford, buying }"
        @click="handleBuy"
      >
        <div
          v-for="p in particles"
          :key="p.id"
          class="particle"
          :style="{ '--angle': p.angle + 'deg' }"
        >
          <img v-if="selectedPlant === 'trees'"     src="/pics/tree_grown.png">
          <img v-if="selectedPlant === 'mushrooms'" src="/pics/mushroom_grown.png">
          <img v-if="selectedPlant === 'potatoes'"  src="/pics/potato_grown.png">
        </div>
        <img v-if="selectedPlant === 'trees'"     src="/pics/tree_grown.png">
        <img v-if="selectedPlant === 'mushrooms'" src="/pics/mushroom_grown.png">
        <img v-if="selectedPlant === 'potatoes'"  src="/pics/potato_grown.png">
        <p>{{ cost }}</p>
      </div>
    </div>
    <Transition name="flash">
      <div v-if="buying" class="boughtOverlay">PURCHASED!</div>
    </Transition>
  </li>
</template>

<style scoped>
img {
  pointer-events: none;
}
.offer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-image: url('/pics/wooden_planks.png');
  background-size: cover;
  color: #f7f9f9;
  overflow: hidden;
}
.offer img {
  height: 8rem;
}
.offer:hover {
  background-color: #a76d607b;
}
.offer p:first-child {
  font-size: 2rem;
  font-weight: bold;
}
.offer p:nth-child(2) {
  font-size: 1.2rem;
  font-weight: bold;
}
.offerDesc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.75rem;
}

/* ── Buy button ── */
.purchaseBtn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
  cursor: pointer;
  overflow: visible;
}
.purchaseBtn img {
  height: 1.5rem;
}
.purchaseBtn:hover {
  background-color: #00c88b;
}
.purchaseBtn.disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}
.purchaseBtn.buying {
  animation: btnSquish 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}
@keyframes btnSquish {
  0%   { transform: scale(1); }
  15%  { transform: scale(0.80, 1.15); }
  35%  { transform: scale(1.2,  0.85); }
  55%  { transform: scale(0.93, 1.07); }
  75%  { transform: scale(1.05, 0.97); }
  100% { transform: scale(1); }
}

/* ── Particles ── */
.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  pointer-events: none;
  animation: particleFly 0.65s ease-out forwards;
}
.particle img {
  height: 1rem;
  transform: translateX(-50%) translateY(-50%);
}
@keyframes particleFly {
  0% {
    opacity: 1;
    transform: rotate(var(--angle)) translateX(0) scale(1);
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(var(--angle)) translateX(3.5rem) scale(0.2) rotate(360deg);
  }
}

/* ── PURCHASED! overlay ── */
.boughtOverlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: 0.05em;
  color: #fff;
  text-shadow: 0 0 12px #ffd700, 0 0 30px #ffa500;
  background: rgba(0, 166, 118, 0.55);
  pointer-events: none;
}
.flash-enter-active {
  animation: flashIn 0.7s ease-out both;
}
.flash-leave-active {
  animation: flashIn 0.2s ease-in reverse both;
}
@keyframes flashIn {
  0%   { opacity: 0; transform: scale(0.6); }
  30%  { opacity: 1; transform: scale(1.08); }
  100% { opacity: 1; transform: scale(1); }
}
</style>
