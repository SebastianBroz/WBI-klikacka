<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useCounterStore } from '../stores/counter.ts';
import { selectedPlant } from '../composables/usePlant.ts';

const store = useCounterStore();
const audioRef = ref<HTMLAudioElement | null>(null);
const saveInputRef = ref<HTMLInputElement | null>(null);
const showAudioDropdown = ref(false);
const emit = defineEmits(['resetRequested']);
const playerName = ref(localStorage.getItem('wbi-klikacka-player-name') || '');
const leaderboard = ref<Array<{ name: string; score: number; prestige: number; updatedAt: string }>>([]);
const serverStatus = ref('');
const serverLoading = ref(false);
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000/api';
const SERVER_START_MESSAGE = `Server unavailable. Start it with \`npm run start-server\` in the vite-project folder.`;

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

const getSavePayload = () => {
  const sanitizedName = String(playerName.value || '').trim();
  localStorage.setItem('wbi-klikacka-player-name', sanitizedName);
  return {
    name: sanitizedName,
    score: Math.round(store.count),
    prestigeLevel: Number(store.prestigeLevel) || 0,
    saveData: {
      count: store.count,
      fertilizerLevel: store.fertilizerLevel,
      pesticideLevel: store.pesticideLevel,
      pesticideExpiry: store.pesticideExpiry,
      bigCursorPerkOwned: store.bigCursorPerkOwned,
      achievements: store.achievements,
      lastSessionTime: store.lastSessionTime,
      endingDismissed: store.endingDismissed,
      savedActiveEvent: store.savedActiveEvent,
      savedEventExpiry: store.savedEventExpiry,
      musicVolume: store.musicVolume,
      effectsVolume: store.effectsVolume,
      musicMuted: store.musicMuted,
      effectsMuted: store.effectsMuted,
      animationsDisabled: store.animationsDisabled,
      prestigeLevel: store.prestigeLevel,
    },
    plantData: localStorage.getItem('wbi-klikacka-plant') || '',
  };
};

const requestReset = () => {
  emit('resetRequested');
};

const fetchLeaderboard = async () => {
  serverStatus.value = `Checking ${SERVER_URL}...`;
  serverLoading.value = true;
  try {
    const response = await fetch(`${SERVER_URL}/leaderboard`);
    if (!response.ok) throw new Error('Leaderboard request failed');
    leaderboard.value = await response.json();
    serverStatus.value = 'Leaderboard updated';
  } catch (error) {
    console.error(error);
    serverStatus.value = SERVER_START_MESSAGE;
  } finally {
    serverLoading.value = false;
  }
};

const saveToServer = async () => {
  const payload = getSavePayload();
  if (!payload.name) {
    serverStatus.value = 'Enter your player name first';
    return;
  }

  serverStatus.value = '';
  serverLoading.value = true;
  try {
    const response = await fetch(`${SERVER_URL}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Save failed');
    await response.json();
    serverStatus.value = 'Saved to server';
    await fetchLeaderboard();
  } catch (error) {
    console.error(error);
    serverStatus.value = SERVER_START_MESSAGE;
  } finally {
    serverLoading.value = false;
  }
};

const loadFromServer = async () => {
  const safeName = String(playerName.value || '').trim();
  if (!safeName) {
    serverStatus.value = 'Enter your player name first';
    return;
  }

  serverStatus.value = '';
  serverLoading.value = true;
  try {
    const response = await fetch(`${SERVER_URL}/save/${encodeURIComponent(safeName)}`);
    if (response.status === 404) {
      serverStatus.value = 'No server save found for that name';
      return;
    }
    if (!response.ok) throw new Error('Server load failed');
    const data = await response.json();
    if (data && data.saveData) {
      store.loadGameData(data.saveData);
      if (data.plantData) {
        localStorage.setItem('wbi-klikacka-plant', data.plantData);
        selectedPlant.value = data.plantData;
      }
      store.saveGame();
      serverStatus.value = 'Loaded save from server';
    }
  } catch (error) {
    console.error(error);
    if (!serverStatus.value) serverStatus.value = SERVER_START_MESSAGE;
  } finally {
    serverLoading.value = false;
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

  fetchLeaderboard();
});

watch(() => store.musicVolume, () => updateAudioVolume());
watch(() => store.musicMuted, (muted) => {
  updateAudioVolume();
  if (!muted) {
    playAudio();
  }
});

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

const downloadSaveFile = () => {
  const saveData = localStorage.getItem('wbi-klikacka-save');
  const plantData = localStorage.getItem('wbi-klikacka-plant');
  const payload = {
    save: saveData,
    plant: plantData,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'wbi-klikacka-save.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const promptLoadSaveFile = () => {
  saveInputRef.value?.click();
};

const loadSaveFile = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    let saveString = '';
    let plantString = '';

    if (parsed && typeof parsed === 'object' && 'save' in parsed) {
      saveString = parsed.save ?? '';
      plantString = parsed.plant ?? '';
    } else {
      saveString = text;
    }

    if (saveString) {
      localStorage.setItem('wbi-klikacka-save', saveString);
      store.loadGame();
    }

    if (plantString) {
      localStorage.setItem('wbi-klikacka-plant', plantString);
      selectedPlant.value = plantString;
    }
  } catch (error) {
    console.error('Failed to load save file:', error);
  } finally {
    if (input) input.value = '';
  }
};
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
        <div class="saveControls">
          <button type="button" @click="downloadSaveFile">Export save</button>
          <button type="button" @click="promptLoadSaveFile">Import save</button>
          <button type="button" @click="requestReset">Reset game</button>
          <input ref="saveInputRef" type="file" accept="application/json,.json" @change="loadSaveFile" style="display: none;" />
        </div>
        <div class="serverControls">
          <h3>Server save & leaderboard</h3>
          <input
            class="serverName"
            type="text"
            placeholder="Player name"
            v-model="playerName"
          />
          <div class="serverButtons">
            <button type="button" @click="saveToServer" :disabled="serverLoading">Save to server</button>
            <button type="button" @click="loadFromServer" :disabled="serverLoading">Load from server</button>
            <button type="button" @click="fetchLeaderboard" :disabled="serverLoading">Refresh leaderboard</button>
          </div>
          <p class="serverStatus">{{ serverStatus }}</p>
          <div class="leaderboard" v-if="leaderboard.length">
            <div class="leaderboardTitle">Top players</div>
            <ol>
              <li v-for="entry in leaderboard" :key="entry.name">
                <span class="leaderName">{{ entry.name }}</span>
                <span class="leaderScore">{{ entry.score.toLocaleString() }} pts</span>
                <span class="leaderPrestige">×{{ entry.prestige }}</span>
              </li>
            </ol>
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
  left: calc(100%);
  bottom: 0;
  width: 22rem;
  background: rgba(8, 12, 22, 0.96);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 1rem;
  box-shadow: 0 18px 45px rgba(0,0,0,0.35);
  padding: 1rem;
  z-index: 20;
}
.audioSetting, .disableAnimations, .saveControls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.audioSetting:last-child,
.saveControls:last-child {
  margin-bottom: 0;
}
.saveControls {
  flex-direction: column;
}
.saveControls button {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
  color: #f7f9f9;
  cursor: pointer;
  border-radius: 0.75rem;
  font-weight: 700;
}
.saveControls button:hover {
  background: rgba(255,255,255,0.14);
}
.serverControls {
  flex-direction: column;
  align-items: stretch;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  gap: 0.75rem;
}
.serverControls h3 {
  font-size: 1rem;
  color: #fff;
}
.serverName {
  width: 100%;
  padding: 0.7rem 0.85rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}
.serverButtons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.serverStatus {
  min-height: 1.2rem;
  color: #c8f3ff;
  font-size: 0.9rem;
}
.leaderboard {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.85rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.leaderboardTitle {
  margin-bottom: 0.55rem;
  font-weight: 700;
  color: #fff;
}
.leaderboard ol {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.4rem;
}
.leaderboard li {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.7rem;
  align-items: center;
  font-size: 0.9rem;
  color: #fff;
  padding: 0.55rem 0.75rem;
  border-radius: 0.75rem;
  background: rgba(0, 0, 0, 0.14);
}
.leaderScore,
.leaderPrestige {
  font-weight: 700;
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
@media (max-width: 800px) {
.audioDropdown{
  bottom: calc(100% + 0.5rem);
  left: -3.75rem;
}
}
</style>