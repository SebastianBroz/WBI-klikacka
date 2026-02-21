<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <li class="perk">
    <img src="/perk_rainstorm.png">
    <div class="perkDesc">
      <p>Perk</p>
      <p>description description description description description description description description description description description </p>
    </div>
  </li>
</template>

<style scoped>
.perk {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #f7f9f9;
  background-image: url('../public/wooden_planks.png');
  background-size: cover;
}
.perk img {
  height: 6rem;
}
.perkDesc {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.perk:hover {
  background-color: #a76d607b;
}
.perk p:first-child {
  font-size: 1.2em;
  font-weight: bold;
}
</style>
