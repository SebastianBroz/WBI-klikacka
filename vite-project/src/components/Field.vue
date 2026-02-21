<script setup lang="ts">
import { ref } from 'vue'
</script>

<template>
  <div class="field">
    <img src="/tree_sapling.png">
    <div class="timeBar"></div>
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
  height: 3rem;
}/*middle sized strom bude vetsi a fully grown strom bude jeste vetsi */
</style>
