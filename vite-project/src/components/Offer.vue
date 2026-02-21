<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <li class="offer">
    <img src="/tree_sapling.png">
    <div class="offerDesc">
      <p>Item</p>
      <p>description description description description description description description description description description description </p>
      <div class="purchaseBtn">
        <img src="/tree_grown.png">
        <p>--var</p>
      </div>
    </div>
  </li>
</template>

<style scoped>
.offer {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-image: url('../public/wooden_planks.png');
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
  font-size: 1.2em;
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
}
.purchaseBtn img {
  height: 1.5rem;
}
.purchaseBtn:hover {
  background-color: #00c88b;
}
</style>
