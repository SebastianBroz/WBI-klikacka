<script setup lang="ts">

const props = defineProps<{
  title: string,
  description: string,
  img: string

}>();
</script>

<template>
  <li class="perk">
    <img :src=props.img>
    <div class="perkDesc">
      <p>{{title}}</p>
      <p>{{description }}</p>
    </div>
  </li>
</template>

<style scoped>
img{
  pointer-events: none;
}
.perk {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #f7f9f9;
  background-image: url('/pics/wooden_planks.png');
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
  font-size: 2rem;
  font-weight: bold;
}
.perk p:nth-child(2) {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
