<!--Toto ma slouzit jako collectible, ktery bude nahodne vypadavat z policek
a pri collectnuti prida hodne meny.
Nuti to uzivatele byt aktivni, pokud chce maximalni rust ve hre-->
<script setup lang="ts">
import { selectedPlant } from '../composables/usePlant'
/*WORK IN PROGRESS KOMPONENTA*/
const props = defineProps<{ x: number; y: number; flashing: boolean; img?: string }>();
const emit = defineEmits<{ collect: [] }>()
</script>

<template>
  <div
    class="collectible"
    :class="{ flashing: props.flashing }"
    @click.stop="emit('collect')"
    :style="{ top: props.y + '%', left: props.x + '%' }"
  >
    <template v-if="props.img">
      <img :src="props.img" style="pointer-events: none;">
    </template>
    <template v-else>
      <img v-if="selectedPlant === 'trees'"     src="/pics/tree_grown.png"     style="pointer-events: none;">
      <img v-if="selectedPlant === 'mushrooms'" src="/pics/mushroom_grown.png" style="pointer-events: none;">
      <img v-if="selectedPlant === 'potatoes'"  src="/pics/potato_grown.png"   style="pointer-events: none;">
    </template>
  </div>
</template>

<style scoped>
div {
  position: absolute;
  transform: translate(-50%, -50%);
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
.flashing {
  animation: flash 0.4s ease-in-out infinite alternate;
}
@keyframes flash {
  from { opacity: 1; }
  to   { opacity: 0.1; }
}
</style>
