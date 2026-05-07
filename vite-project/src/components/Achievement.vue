<script setup lang="ts">
const props = defineProps<{
  title: string,
  description: string,
  img?: string
}>();
</script>

<template>
  <Transition name="achievement-item">
    <li class="achievement">
    <img v-if="props.img" :src="props.img">
    <div class="achievmentDesc">
      <p>{{title}}</p>
      <p>{{description}}</p>
    </div>
  </li>
  </Transition>
</template>

<style scoped>
img{
  pointer-events: none;
}
.achievement
{
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #f7f9f9;
  background-image: url('/pics/wooden_planks.png');
  background-size: cover;
}
.achievement img {
  height: 6rem;
}
.achievement:hover {
  background-color: #a76d607b;
}
.achievement p:first-child {
  font-size: 2rem;
  font-weight: bold;
}
.achievement p:nth-child(2) {
  font-size: 1.2rem;
  font-weight: bold;
}
.achievement-item-enter-active,
.achievement-item-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.achievement-item-enter-from,
.achievement-item-leave-to {
  opacity: 0;
  transform: translateX(-1rem);
}
.achievement-item-enter-to,
.achievement-item-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
