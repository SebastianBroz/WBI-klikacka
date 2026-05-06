<!--Toto ma slouzit jako collectible, ktery bude nahodne vypadavat z policek
a pri collectnuti prida hodne meny.
Nuti to uzivatele byt aktivni, pokud chce maximalni rust ve hre-->
<script setup lang="ts">
import { selectedPlant } from '../composables/usePlant'
/*WORK IN PROGRESS KOMPONENTA*/
const emit = defineEmits<{ collect: [] }>()

</script>

<template>
  <div class="collectible" @click.stop="emit('collect')" v-if="selectedPlant === 'trees'">
    <img src="/pics/tree_grown.png" style="pointer-events: none;">
  </div>
  <div class="collectible" @click.stop="emit('collect')" v-if="selectedPlant === 'mushrooms'">
    <img src="/pics/mushroom_grown.png" style="pointer-events: none;">
  </div>
  <div class="collectible" @click.stop="emit('collect')" v-if="selectedPlant === 'potatoes'">
    <img src="/pics/potato_grown.png" style="pointer-events: none;">
  </div>
</template>

<style scoped>
div {
  position: absolute;
  right: 50%;
  top: 50%;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.555);
  box-shadow: 0 0 4px 4px rgba(255, 255, 255, 0.555);
  border-radius: 50%;
}
img{
  height: 4rem;
}
@keyframes bounce {
  from { transform: translate(-50%, -100%); }
  to   { transform: translate(-50%, calc(-100% - 8px)); }
}
</style>
