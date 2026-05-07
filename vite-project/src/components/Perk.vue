<script setup lang="ts">
import { selectedPlant } from '../composables/usePlant'

const props = defineProps<{
  title: string
  description: string
  img: string
  cost?: number
  canAfford?: boolean
  owned?: boolean
}>()

const emit = defineEmits<{ buy: [] }>()
</script>

<template>
  <li class="perk" :class="{ owned }">
    <img :src="props.img">
    <div class="perkDesc">
      <p>{{ title }}</p>
      <p>{{ description }}</p>
      <Transition name="owned-badge" mode="out-in">
        <div v-if="owned" key="owned" class="ownedBadge">✓ OWNED</div>
        <div
          v-else-if="cost !== undefined"
          key="buy"
          class="buyBtn"
          :class="{ disabled: !canAfford }"
          @click="canAfford && emit('buy')"
        >
          <img v-if="selectedPlant === 'trees'"     src="/pics/tree_grown.png">
          <img v-if="selectedPlant === 'mushrooms'" src="/pics/mushroom_grown.png">
          <img v-if="selectedPlant === 'potatoes'"  src="/pics/potato_grown.png">
          <p>{{ cost }}</p>
        </div>
      </Transition>
    </div>
  </li>
</template>

<style scoped>
img {
  pointer-events: none;
}
.perk {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #f7f9f9;
  background-image: url('/pics/wooden_planks.png');
  background-size: cover;
  transition: background-color 0.2s;
}
.perk img {
  height: 6rem;
}
.perkDesc {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.4rem;
}
.perk:hover {
  background-color: #a76d607b;
}
.perk p:first-child {
  font-size: 2rem;
  font-weight: bold;
}
.perk p:nth-child(2) {
  font-size: 1.2rem;
  font-weight: bold;
}

.buyBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
  cursor: pointer;
  font-size: 1.1rem;
}
.buyBtn img {
  height: 1.5rem;
}
.buyBtn:hover {
  background-color: #00c88b;
}
.buyBtn.disabled {
  background-color: #666;
  cursor: not-allowed;
  opacity: 0.6;
}

.ownedBadge {
  padding: 0.2rem 0.8rem;
  background-color: #ffd700;
  color: #3a2a00;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.05em;
}
.perk.owned {
  background-color: rgba(255, 215, 0, 0.08);
}
.owned-badge-enter-active,
.owned-badge-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.owned-badge-enter-from,
.owned-badge-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
.owned-badge-enter-to,
.owned-badge-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
