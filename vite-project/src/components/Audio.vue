<script setup lang="ts">
import { ref, onMounted } from 'vue';

const isMuted = ref(false);
const audioRef = ref<HTMLAudioElement | null>(null);

const toggleAudio = () => {
  if (audioRef.value) {
    audioRef.value.muted = !audioRef.value.muted;
    isMuted.value = audioRef.value.muted;
  }
};

onMounted(() => {
  audioRef.value = document.getElementById("myAudio") as HTMLAudioElement;
  if (audioRef.value) {
    audioRef.value.volume = 0.2;
  }
});
</script>

<template>
  <audio id="myAudio" loop autoplay>
    <source src="/audio/bg-music.mp3" type="audio/mpeg">
  </audio>
  <img 
    id="toggleImg" 
    :src="isMuted ? '/pics/audio_off.png' : '/pics/audio_on.png'" 
    @click="toggleAudio"
  />
</template>

<style>
img {
  cursor: pointer;
}
</style>