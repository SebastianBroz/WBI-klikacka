<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <img src="../public/grown_tree.png">
</template>

<style scoped>
img {
  height: 4rem;
}
</style>
