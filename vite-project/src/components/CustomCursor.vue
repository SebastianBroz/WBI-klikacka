<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCounterStore } from '../stores/counter'

const store = useCounterStore()

const dotX = ref(-200)
const dotY = ref(-200)
const ringLeft = ref(-200)
const ringTop = ref(-200)
let mX = -200, mY = -200
let rX = -200, rY = -200
let raf: number

const onMove = (e: MouseEvent) => {
  mX = e.clientX
  mY = e.clientY
  dotX.value = mX
  dotY.value = mY
}

const loop = () => {
  rX += (mX - rX) * 0.1
  rY += (mY - rY) * 0.1
  ringLeft.value = rX
  ringTop.value = rY
  raf = requestAnimationFrame(loop)
}

interface Ripple { id: number; x: number; y: number }
const ripples = ref<Ripple[]>([])
let rid = 0

const onClick = (e: MouseEvent) => {
  const id = rid++
  ripples.value.push({ id, x: e.clientX, y: e.clientY })
  setTimeout(() => {
    const i = ripples.value.findIndex(r => r.id === id)
    if (i !== -1) ripples.value.splice(i, 1)
  }, 850)
}

onMounted(() => {
  window.addEventListener('mousemove', onMove)
  window.addEventListener('click', onClick)
  raf = requestAnimationFrame(loop)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
  window.removeEventListener('click', onClick)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <Teleport to="body">
    <div class="c-dot" :style="{ left: dotX + 'px', top: dotY + 'px' }"></div>
    <div class="c-ring-wrap" :style="{ left: ringLeft + 'px', top: ringTop + 'px' }">
      <div class="c-ring" :class="{ big: store.bigCursorPerkOwned }"></div>
    </div>
    <div
      v-for="r in ripples"
      :key="r.id"
      class="c-ripple"
      :class="{ big: store.bigCursorPerkOwned }"
      :style="{ left: r.x + 'px', top: r.y + 'px' }"
    ></div>
  </Teleport>
</template>

<style scoped>
/* ── Seed dot ── */
.c-dot {
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  width: 11px;
  height: 14px;
  background: radial-gradient(ellipse at 38% 30%, #c8f08c, #236b18);
  border-radius: 50% 50% 46% 46% / 55% 55% 45% 45%;
  transform: translate(-50%, -50%);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.45),
    0 0 7px rgba(80, 180, 50, 0.3);
  animation: seedBreath 2.4s ease-in-out infinite;
  will-change: left, top;
}
@keyframes seedBreath {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50%       { transform: translate(-50%, -50%) scale(1.28); }
}

.c-ring-wrap {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  will-change: left, top;
}

.c-ring {
  position: relative;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 2px solid rgba(72, 128, 48, 0.75);
  animation: ringCCW 6s linear infinite;
  transition:
    width  0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    border-color 0.3s;
}

.c-ring::before {
  content: '';
  position: absolute;
  left: 50%; top: -4px;
  width: 1px;
  height: calc(100% + 8px);
  background: rgba(72, 128, 48, 0.35);
  transform: translateX(-50%);
}

.c-ring::after {
  content: '';
  position: absolute;
  top: 50%; left: -4px;
  width: calc(100% + 8px);
  height: 1px;
  background: rgba(72, 128, 48, 0.35);
  transform: translateY(-50%);
}

.c-ring.big {
  width: 58px;
  height: 58px;
  border-color: rgba(210, 160, 30, 0.9);
  box-shadow: 0 0 14px rgba(210, 160, 30, 0.35);
}
.c-ring.big::before,
.c-ring.big::after {
  background: rgba(210, 160, 30, 0.3);
}

@keyframes ringCCW {
  to { transform: rotate(-360deg); }
}

.c-ripple {
  position: fixed;
  pointer-events: none;
  z-index: 9998;
  width: 0;
  height: 0;
}
.c-ripple::before {
  content: '';
  position: absolute;
  left: 0; top: 0;
  width: 90px; height: 90px;
  border-radius: 50%;
  border: 2px solid #5cb85c;
  box-shadow: 0 0 10px rgba(92, 184, 92, 0.5);
  transform: translate(-50%, -50%) scale(0);
  animation: cRipple 0.75s ease-out forwards;
}
.c-ripple::after {
  content: '';
  position: absolute;
  left: 0; top: 0;
  width: 48px; height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(140, 210, 80, 0.55);
  transform: translate(-50%, -50%) scale(0);
  animation: cRipple 0.75s ease-out 0.13s forwards;
}

/* Titan's Touch — harvest-gold ripple */
.c-ripple.big::before {
  width: 340px; height: 340px;
  border-width: 3px;
  border-color: #d4a520;
  box-shadow: 0 0 22px rgba(212, 165, 32, 0.6), 0 0 55px rgba(212, 165, 32, 0.18);
}
.c-ripple.big::after {
  width: 190px; height: 190px;
  border-color: rgba(212, 165, 32, 0.5);
  animation-delay: 0.18s;
}

@keyframes cRipple {
  0%   { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  70%  { opacity: 0.7; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
}
</style>
