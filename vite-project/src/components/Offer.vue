<script setup lang="ts">
import { selectedPlant } from '../composables/usePlant'

const props = defineProps<{
  title: string,
  description: string,
  img: string

}>();
</script>

<template>
  <li class="offer">
    <img :src=props.img>
    <div class="offerDesc">
      <p>{{ title }}</p>
      <p>{{description}}</p>
      <div class="purchaseBtn">
        <img v-if="selectedPlant === 'trees'" src="/pics/tree_grown.png">
        <img v-if="selectedPlant === 'mushrooms'" src="/pics/mushroom_grown.png">
        <img v-if="selectedPlant === 'potatoes'" src="/pics/potato_grown.png">
        <p>--var</p>
      </div>
    </div>
  </li>
</template>

<style scoped>
img{
  pointer-events: none;
}
.offer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-image: url('/pics/wooden_planks.png');
  background-size: cover;
  color: #f7f9f9;
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
.purchaseBtn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
  cursor: pointer;
}
.purchaseBtn img {
  height: 1.5rem;
}
.purchaseBtn:hover {
  background-color: #00c88b;
}
</style>
