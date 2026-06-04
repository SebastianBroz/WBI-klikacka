<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useCounterStore } from '../stores/counter.ts';

const store = useCounterStore();
const audioRef = ref<HTMLAudioElement | null>(null);

const updateAudioVolume = () => {
  if (!audioRef.value) return;
  audioRef.value.volume = store.musicVolume;
  audioRef.value.muted = store.musicMuted;
};

const playAudio = () => {
  if (audioRef.value && !store.musicMuted) {
    audioRef.value.play().catch(() => {
      console.log('Autoplay blocked, waiting for user interaction');
    });
  }
};

onMounted(() => {
  audioRef.value = document.getElementById('myAudio') as HTMLAudioElement;
  if (audioRef.value) {
    updateAudioVolume();
    playAudio();

    const enableAudioOnInteraction = () => {
      playAudio();
      document.removeEventListener('click', enableAudioOnInteraction);
      document.removeEventListener('touchstart', enableAudioOnInteraction);
    };

    document.addEventListener('click', enableAudioOnInteraction);
    document.addEventListener('touchstart', enableAudioOnInteraction);
  }
});

watch(() => store.musicVolume, () => updateAudioVolume());
watch(() => store.musicMuted, (muted) => {
  updateAudioVolume();
  if (!muted) {
    playAudio();
  }
});

const showAudioDropdown = ref(false);

const musicVolume = computed<number>({
  get: () => Math.round(store.musicVolume * 100),
  set: (value: number) => store.setMusicVolume(value / 100),
});

const effectsVolume = computed<number>({
  get: () => Math.round(store.effectsVolume * 100),
  set: (value: number) => store.setEffectsVolume(value / 100),
});

const animationsDisabled = computed<boolean>({
  get: () => store.animationsDisabled,
  set: (value: boolean) => {
    store.animationsDisabled = value;
  },
});
</script>

<template>
  <audio id="myAudio" loop>
    <source src="/audio/bg-music.mp3" type="audio/mpeg">
  </audio>
  <div class="settings">
    <div class="audioMenu">
      <button class="audioTrigger" @click="showAudioDropdown = !showAudioDropdown" type="button">
        <img src="/pics/cog_wheel.png" alt="Audio settings" />
      </button>
      <div class="audioDropdown" v-if="showAudioDropdown">
        <div class="audioSetting">
          <img src="/pics/audio_on.png" alt="Music" />
          <div class="audioSettingContent">
            <label>Music</label>
            <input type="range" min="0" max="100" step="1" v-model.number="musicVolume" />
          </div>
        </div>
        <div class="audioSetting">
          <img src="/pics/audio_on.png" alt="Sound effects" />
          <div class="audioSettingContent">
            <label>Sound effects</label>
            <input type="range" min="0" max="100" step="1" v-model.number="effectsVolume" />
          </div>
        </div>
        <div class="disableAnimations">
          <div class="disableAnimationsContent">
            <label>Disable animations</label>
            <input type="checkbox" v-model="animationsDisabled" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
img {
  cursor: pointer;
}
.audioMenu{
  position: relative;
}
.audioTrigger{
  min-width: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
}
.audioTrigger img{
  height: 5rem;
}
.audioDropdown{
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  width: 22rem;
  background: rgba(8, 12, 22, 0.96);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 1rem;
  box-shadow: 0 18px 45px rgba(0,0,0,0.35);
  padding: 1rem;
  z-index: 20;
}
.audioSetting, .disableAnimations{
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.audioSetting:last-child{
  margin-bottom: 0;
}
.audioSetting img{
  height: 2rem;
}
.audioSettingContent, .disableAnimationsContent{
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  width: 100%;
}
.disableAnimationsContent{
  flex-direction: row;
}
.audioSettingContent label{
  font-size: 0.95rem;
  font-weight: 700;
  color: #f7f9f9;
}
.audioSettingContent input[type=range]{
  width: 100%;
  accent-color: #00c88b;
}
@media (max-width: 500px) {
.audioDropdown{
  width: 16rem;
}
}
</style>