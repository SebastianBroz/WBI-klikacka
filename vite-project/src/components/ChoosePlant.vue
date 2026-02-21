<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="shadow">
    <div class="choosePlantPopup">
      <p>Choose your plant!</p>
      <p>Each plant tells a different story, so choose wisely!</p>
      <div class="plantOptions">
        <img src="/tree_grown.png">
        <img src="/mushroom_brown.png">
        <img src="/potato.png">
        <!--<img src="/alive_plants.png">-->
      </div>
    </div>
  </div>
</template>

<style scoped>
.shadow
{
  width: 100vw; height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
}
.choosePlantPopup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('../public/wooden_planks.png');
  background-size: cover;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.choosePlantPopup p:first-child {
  color: #f7f9f9;
  font-size: 1.5em;
  text-align: center;
}
.choosePlantPopup p:nth-child(2) {
  color: #f7f9f9;
  margin-bottom: 1rem;
  text-align: center;
} 
.choosePlantPopup img {
  height: 8rem;
  cursor: pointer;
}
.choosePlantPopup img:hover {
  background-color: #f7f9f96e;
}
.plantOptions {
  display: flex;
  justify-content: center;
  gap: 1rem;
}
</style>
