<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <li class="achievement">
    <img src="/achievement_forest_ending.png">
    <div class="achievmentDesc">
      <p>Achievement</p>
      <p>description description description description description description description description description description description </p>
    </div>
  </li>
</template>

<style scoped>
.achievement
{
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #f7f9f9;
  background-image: url('../public/wooden_planks.png');
  background-size: cover;
}
.achievement img {
  height: 6rem;
}
.achievement:hover {
  background-color: #a76d607b;
}
.achievement p:first-child {
  font-size: 1.2em;
  font-weight: bold;
}
.achievement p:nth-child(2) {
  font-size: 0.7  5em;
  font-weight: bold;
}
</style>
