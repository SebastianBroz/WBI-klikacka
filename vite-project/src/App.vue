<!--Vyuzito ChatGPT pro obrazky, inspiraci a vice a Claude:
https://chatgpt.com/share/69998f74-342c-8002-94fd-e8ed5e74cbb0
https://chatgpt.com/share/69998fa0-ba34-8002-a4b1-b2f852251980
https://chatgpt.com/share/69998fad-e954-8002-b2b8-4c591f545872
https://claude.ai/share/fd8cab84-7071-4043-ae01-7f617112934a
-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import ChoosePlant from './components/ChoosePlant.vue';
import Field from './components/Field.vue';
import Offer from './components/Offer.vue';
import Perk from './components/Perk.vue';
import Achievement from './components/Achievement.vue'
import Ending from './components/Ending.vue';
import { useCounterStore } from "./stores/counter.ts"
import Audio from "./components/Audio.vue"
import CustomCursor from "./components/CustomCursor.vue"
import { selectedPlant, isChoosingPlant, resetPlantSelection } from './composables/usePlant'
import { activeEvent, eventTimeRemaining } from './composables/useEvents'
import { setupAchievementWatchers } from './composables/useAchievements'
import { setupEventLogic, cleanupEventLogic } from './composables/useEventLogic'
import { useShop } from './composables/useShop'

const store = useCounterStore();

setupAchievementWatchers(store);

const { restoreEvent, scheduleDayEvents, countdownDisplay, pesticideTimeRemaining, startPesticideTimer, stopPesticideTimer } = setupEventLogic(store);

const { shopItems } = useShop(store);

const currentSection = ref('shopOffers');
const showResetConfirm = ref(false);

const changeSection = (section: string) => {
  currentSection.value = section;
};

const resetGame = () => {
  showResetConfirm.value = true;
};

const confirmReset = () => {
  showResetConfirm.value = false;
  store.resetGame();
  resetPlantSelection();
  cleanupEventLogic();
  activeEvent.value = null;
  eventTimeRemaining.value = 0;
  scheduleDayEvents();
};

const cancelReset = () => {
  showResetConfirm.value = false;
};

let autoSaveInterval: ReturnType<typeof setInterval> | null = null;
let handleBeforeUnload: (() => void) | null = null;

onMounted(() => {
  store.loadGame();
  restoreEvent();

  const now = Date.now();
  const lastSessionTime = store.lastSessionTime;
  if (lastSessionTime > 0) {
    const elapsedMs = now - lastSessionTime;
    const offlineGains = store.calculateOfflineGains(elapsedMs);
    if (offlineGains > 0) {
      console.log(`Offline zisky: +${offlineGains}`);
    }
  }
  
  store.lastSessionTime = now;
  store.saveGame();
  
  autoSaveInterval = setInterval(() => {
    store.saveGame();
  }, 10000);
  
  handleBeforeUnload = () => {
    store.saveGame();
  };
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('pagehide', handleBeforeUnload);
  
  scheduleDayEvents()
  startPesticideTimer()
})

onUnmounted(() => {
  if (autoSaveInterval) clearInterval(autoSaveInterval);
  if (handleBeforeUnload) {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handleBeforeUnload);
  }
  store.saveGame();
  cleanupEventLogic()
  stopPesticideTimer()
})
</script>

<template>
  <CustomCursor />
  <TransitionGroup name="achievement-popup" tag="div" class="achievement-popups">
    <div v-for="achievement in store.newAchievements" :key="achievement.title" class="achievement-popup">
      <img :src="achievement.img" alt="achievement icon" />
      <div class="achievement-text">
        <h3>Achievement Unlocked!</h3>
        <p>{{ achievement.title }}</p>
        <small>{{ achievement.description }}</small>
      </div>
    </div>
  </TransitionGroup>
  <div class="container">
    <main>
      <ChoosePlant v-if="isChoosingPlant"/>
      <Transition name="ending-popup">
        <Ending v-if="store.count >= 1000000000 && !store.endingDismissed" @close="store.endingDismissed = true"/>
      </Transition>
          <section class="stats">
            <Transition name="event-banner">
              <div class="buffOrNerf" :class="activeEvent === 'rain' ? 'buffOrNerf--buff' : 'buffOrNerf--nerf'" v-if="activeEvent">
                <div class="temporary">
                  <img :src="activeEvent === 'rain' ? '/pics/event_rain.png' : '/pics/event_insect_attack.png'" style="pointer-events: none;">
                  <p class="event-name">{{ activeEvent === 'rain' ? 'Rainstorm' : 'Insect Attack' }}</p>
                  <p class="event-tip" :class="activeEvent === 'rain' ? 'event-tip--buff' : 'event-tip--nerf'">
                    {{ activeEvent === 'rain'
                      ? '▲ Fields grow 2× faster!'
                      : '▼ Lose 30% of recent gains' }}
                  </p>
                </div>
                <p class="countdown">{{ countdownDisplay }}</p>
              </div>
            </Transition>
            <Transition name="pesticide-timer">
              <div class="pesticideTimer" v-if="pesticideTimeRemaining">
                <img src="" style="pointer-events: none;">
                <p>Pesticide: {{ pesticideTimeRemaining }}</p>
              </div>
            </Transition>
            <!--<div class="treesPerClick">
              <img src="/pics/clock_tpc.png" style="pointer-events: none;">
              <p>{{ selectedPlant.charAt(0).toUpperCase() + selectedPlant.slice(1) }} per click: {{ Math.round(store.fertilizerMultiplier) }}</p>
            </div>-->
            <div class="currencyCount">
              <img src="/pics/tree_grown.png" v-if="selectedPlant === 'trees'" style="pointer-events: none;">
              <img src="/pics/mushroom_grown.png" v-if="selectedPlant === 'mushrooms'" style="pointer-events: none;">
              <img src="/pics/potato_grown.png" v-if="selectedPlant === 'potatoes'" style="pointer-events: none;">
              <p>{{store.count}}</p>
            </div>
            <div
              id="fields-area"
              class="fields"
              :style="selectedPlant === 'trees'     ? 'background-image: url(/pics/grass_floor.png)'  :
                      selectedPlant === 'mushrooms' ? 'background-image: url(/pics/forest_floor.png)' :
                                                      'background-image: url(/pics/soil_floor.png)'"
            >
              <Field v-for="n in 32" :key="n" />
            </div>
            <div class="settings">
              <Audio />
              <button class="resetBtn" @click="resetGame">&#9888; RESET GAME</button>
            </div>
          </section>
          <section class="optionsAndLogo">
            <section class="options">
              <div class="optionsMenu">
                <button @click="changeSection('shopOffers')">SHOP</button>
                <button @click="changeSection('perksList')">PERKS</button>
                <button @click="changeSection('achievements')">ACHIEVEMENTS</button>
              </div>
              <Transition name="options-switch" mode="out-in">
                <div :key="currentSection" class="optionsPanel">
                  <ul v-if="currentSection === 'shopOffers'" class="shopOffers">
                    <Offer
                      v-for="item in shopItems"
                      :key="item.title"
                      :title="item.title"
                      :description="item.description"
                      :img="item.img"
                      :cost="item.cost"
                      :canAfford="item.canAfford"
                      @buy="item.buy"
                    />
                  </ul>
                  <ul v-else-if="currentSection === 'perksList'" class="perksList">
                    <Perk
                      title="Titan's Touch"
                      description="Your clicks shake the earth. The radial effect becomes massive. Drop chance: 0.5% per click."
                      img="/pics/perk_rainstorm.png"
                      :owned="store.bigCursorPerkOwned"
                    />
                  </ul>
                  <ul v-else class="achievementsList">
                    <Achievement
                      v-for="achievement in store.achievements"
                      :key="achievement.title"
                      :title="achievement.title"
                      :description="achievement.description"
                      :img="achievement.img"
                    />
                    <li v-if="store.achievements.length === 0" class="noAchievements">No achievements yet. Keep playing!</li>
                  </ul>
                </div>
              </Transition>
            </section>
            <img src="/pics/logo_pixel.png" alt="logo" style="pointer-events: none"/>
          </section>
        </main>
  </div>

  <Transition name="reset-modal">
    <div v-if="showResetConfirm" class="reset-overlay" @click.self="cancelReset">
      <div class="reset-modal">
        <div class="reset-modal-icon">&#9888;</div>
        <h2 class="reset-modal-title">Start Over?</h2>
        <p class="reset-modal-body">All your progress, upgrades and achievements will be permanently lost!</p>
        <div class="reset-modal-actions">
          <button class="reset-modal-cancel" @click="cancelReset">Cancel</button>
          <button class="reset-modal-confirm" @click="confirmReset">Reset</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
*, *::before, *::after {
  box-sizing: border-box;
}
* {
  margin: 0;
  padding: 0;
}
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
input, button, textarea, select {
  font: inherit;
}
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
p {
  text-wrap: pretty;
}
h1, h2, h3, h4, h5, h6 {
  text-wrap: balance;
}
/*---------------------------*/
p, img, button {
  user-select: none;
}
html, body, #app {
  min-height: 100vh;
}
* {
  cursor: none !important;
}
template {
  height: 100%;
}
.container {
  font-family: "Jersey 10", sans-serif;
  letter-spacing: 10%;
  max-width: 100%;
  min-height: 100vh;
  background-color: #e0d0c1;
  background-image: url(/pics/sky_bg.png);
  background-size: cover;
  padding-top: 2.5rem;
}
img {
  height: 4rem;
}
main {
  display: flex;
  gap: 4rem;
  padding-inline: 3rem;
  align-items: flex-start;
}
.stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  min-height: 0;
}
.event-banner-enter-active {
  animation: eventSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.event-banner-leave-active {
  animation: eventSlideIn 0.3s ease-in reverse both;
}
@keyframes eventSlideIn {
  from {
    opacity: 0;
    transform: translateY(-1.5rem) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.pesticide-timer-enter-active,
.pesticide-timer-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.pesticide-timer-enter-from,
.pesticide-timer-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
.pesticide-timer-enter-to,
.pesticide-timer-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.buffOrNerf{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  border-radius: 0.5rem;
  padding: 0.5rem 2rem;
  border: 2px solid transparent;
  transition: border-color 0.3s;
}
.buffOrNerf--buff {
  background-image: url(/pics/golden_bg.png);
  background-size: cover;
  border-color: #4cff80;
  box-shadow: 0 0 10px rgba(76, 255, 128, 0.25);
}
.buffOrNerf--nerf {
  background: linear-gradient(180deg, #5c2800 0%, #3a1500 100%);
  border-color: #ff5555;
  color: #ffffff;
  box-shadow: 0 0 10px rgba(255, 85, 85, 0.25);
}
.temporary
{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}
.event-name {
  font-size: 1.1rem;
  font-weight: bold;
  color: #f7e0c8;
}
.event-tip {
  font-size: 0.85rem;
  padding: 0.15rem 0.5rem;
  border-radius: 0.25rem;
  font-weight: bold;
  letter-spacing: 0.03em;
}
.event-tip--buff {
  color: #2aff6a;
  background: rgba(0, 80, 20, 0.55);
}
.event-tip--nerf {
  color: #ff7070;
  background: rgba(80, 0, 0, 0.55);
}
.buffOrNerf .countdown{
  font-weight: 900;
  font-size: 2rem;
}
.currencyCount {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5em;
  padding: 0.5rem 1rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
  /*background-image: url('../public/grass.png');
  background-size: cover;*/
  max-width: 50rem;
  width: 100%;
}
.currencyCount img {
  height: 2rem;
}
.pesticideTimer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2em;
  padding: 0.4rem 1rem;
  background-color: #4a7c3f;
  color: #f7f9f9;
  border-radius: 2rem;
  max-width: 50rem;
  width: 100%;
}
.pesticideTimer img {
  height: 2rem;
}
.treesPerClick {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5em;
  padding: 0.5rem 1rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
  max-width: 50rem;
  width: 100%;
}
.treesPerClick img {
  height: 2rem;
}
.fields {
  position: relative;
  display: grid;
  /* each column is at least 5rem but will expand to fill available space evenly */
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  gap: 0.5rem;
  background-size: cover;
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
  max-width: 50rem;
}
.settings{
  display: flex;
}
.options {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 30rem;
}
.optionsAndLogo {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}
.optionsAndLogo img:last-child {
  margin-top: 2rem;
}
::-webkit-scrollbar
{
  width: 0.75rem;
}
::-webkit-scrollbar-track
{
  background-color: #601700;
}
::-webkit-scrollbar-thumb
{
  background-color: #a76d60;
  border-radius: 1rem;
}
::-webkit-scrollbar-thumb:hover
{
  background-color: #c48071;
}
.optionsMenu {
  width: 100%;
  display: flex;
  gap: 0.5rem;
}
.optionsMenu button {
  width: 100%;
  height: 3rem;
  padding: 0.5rem;
  font-size: 1.2em;
  /*background-color: #601700;*/
  background: none;
  background-image: url(/pics/wooden_board.png);
  background-size: cover;
  color: #f7f9f9;
  border: none;
  cursor: pointer;
}
.optionsMenu button:hover {
  /*background-color: #942301;*/
}
/*.optionsMenu button:active {
  background-color: #942301;
}*/
.optionsPanel {
  min-height: 12rem;
}
.resetBtn {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  font-family: inherit;
  letter-spacing: inherit;
  background-size: cover;
  color: #ffaaaa;
  background: linear-gradient(180deg, #5c2800 0%, #3a1500 100%);
  cursor: pointer;
  border-radius: 0.25rem;
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 6px rgba(139, 32, 0, 0.4);
}
.resetBtn:hover {
  color: #ffffff;
  background: linear-gradient(180deg, #6e3100 0%, #4a1c00 100%);
  box-shadow: 0 0 10px rgba(255, 80, 0, 0.55), 0 2px 6px rgba(139, 32, 0, 0.4);
}
.resetBtn:active {
  background: linear-gradient(180deg, #7a1000 0%, #4a0000 100%);
  box-shadow: none;
  opacity: 0.85;
}

.reset-overlay {
  position: fixed;
  inset: 0;
  background: rgba(20, 8, 0, 0.72);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
.reset-modal {
  background: linear-gradient(160deg, #3d1a00 0%, #280d00 60%, #1a0800 100%);
  border: 3px solid #8b2000;
  border-radius: 0.75rem;
  padding: 2rem 2.5rem;
  max-width: 22rem;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px #601700;
  text-align: center;
}
.reset-modal-icon {
  font-size: 3rem;
  line-height: 1;
  color: #ff9040;
  filter: drop-shadow(0 0 8px rgba(255, 120, 0, 0.6));
}
.reset-modal-title {
  font-size: 1.8rem;
  color: #f7e0c8;
  margin: 0;
}
.reset-modal-body {
  font-size: 1.05rem;
  color: #c8a88a;
  line-height: 1.5;
}
.reset-modal-actions {
  display: flex;
  gap: 0.75rem;
  width: 100%;
  margin-top: 0.5rem;
}
.reset-modal-cancel,
.reset-modal-confirm {
  flex: 1;
  padding: 0.6rem 1rem;
  font-size: 1.1rem;
  font-family: inherit;
  letter-spacing: inherit;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: box-shadow 0.2s ease, opacity 0.2s ease, background 0.2s ease;
  border: 2px solid #601700;
}
.reset-modal-cancel {
  background: linear-gradient(180deg, #5c2800 0%, #3a1500 100%);
  color: #e0d0c1;
}
.reset-modal-cancel:hover {
  background: linear-gradient(180deg, #6e3100 0%, #4a1c00 100%);
  box-shadow: 0 0 8px rgba(224, 208, 193, 0.25);
}
.reset-modal-confirm {
  background: linear-gradient(180deg, #7a1000 0%, #4a0000 100%);
  color: #ff9090;
  border-color: #8b2000;
  box-shadow: 0 0 6px rgba(255, 80, 0, 0.3);
}
.reset-modal-confirm:hover {
  background: linear-gradient(180deg, #9a1500 0%, #620000 100%);
  color: #ff5555;
  box-shadow: 0 0 12px rgba(255, 80, 0, 0.6);
}
.reset-modal-cancel:active,
.reset-modal-confirm:active {
  opacity: 0.8;
}

.reset-modal-enter-active,
.reset-modal-leave-active {
  transition: opacity 0.25s ease;
}
.reset-modal-enter-active .reset-modal,
.reset-modal-leave-active .reset-modal {
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
}
.reset-modal-enter-from,
.reset-modal-leave-to {
  opacity: 0;
}
.reset-modal-enter-from .reset-modal {
  transform: scale(0.8) translateY(1.5rem);
}
.reset-modal-leave-to .reset-modal {
  transform: scale(0.9) translateY(0.5rem);
  opacity: 0;
}
.options-switch-enter-active,
.options-switch-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.options-switch-enter-from {
  opacity: 0;
  transform: translateX(1.5rem);
}
.options-switch-leave-to {
  opacity: 0;
  transform: translateX(-1.5rem);
}
.options-switch-enter-to,
.options-switch-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.shopOffers
{
  border: 5px solid #601700;
  overflow: auto;
  max-height: 34rem;
}
.perksList
{
    border: 5px solid #601700;
    overflow: auto;
    max-height: 34rem;
}
.achievementsList {
  border: 5px solid #601700;
  overflow: auto;
  max-height: 34em;
}
.noAchievements {
  padding: 1.5rem;
  color: #f7f9f9;
  text-align: center;
  font-size: 1.2rem;
  list-style: none;
  background-image: url('/pics/wooden_planks.png');
  background-size: cover;
}
@media (max-width: 480px) {
  .reset-modal {
    padding: 1.5rem 1.25rem;
  }
  .reset-modal-icon {
    font-size: 2.25rem;
  }
  .reset-modal-title {
    font-size: 1.4rem;
  }
  .reset-modal-body {
    font-size: 0.9rem;
  }
  .reset-modal-cancel,
  .reset-modal-confirm {
    font-size: 0.95rem;
    padding: 0.5rem 0.6rem;
  }
}
@media (min-width: 320px) and (max-width: 768px) {
  .container{
    background-image: none;
    height: 100%;
  }
  main {
    flex-direction: column;
    padding-inline: 1rem;
    gap: 1rem;
  }
  .buffOrNerf{

  }
  .buffOrNerf img{
    height: 3rem;
  }
  .currencyCount, .timePerClick {
    font-size: 0.75em;
    padding: 0.25rem 0.5rem;
  }
  .pesticideTimer {
    font-size: 0.75em;
    padding: 0.25rem 0.5rem;
  }
  .timePerClick img, .currencyCount img {
    height: 2rem;
  }
  .field img {
    height: 1.5rem; width: 1.5rem;
  }
  .timeBar{
    height: 0.2rem;
    border: 1px solid #e0d0c1;
  }
    .optionsAndLogo {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      gap: 2rem;
    }
  .optionsMenu button {
    height: 2.5rem;
    font-size: 0.75rem;
  }
  .offer, .achievement{
    flex-direction: column;
  }
  .offerDesc p:nth-child(2), .achievmentDesc p:nth-child(2) {
    font-size: 0.75rem;
  }
}
@media (min-width: 769px) and (max-width: 1500px) {
  .container{
    background-image: none;
    height: 100%;
  }
  body
  {
    background-image: none;
    background-color: #e0d0c1;
  }
  .bgImageContainer
  {
    background-color: transparent;
  }
  main {
    flex-direction: column;
    padding-inline: 2rem;
    gap: 2rem;
  }
}
.achievement-popups {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.achievement-popup {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #601700;
  color: #f7f9f9;
  padding: 0.75rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  max-width: 20rem;
  border: 2px solid #a76d60;
}
.achievement-popup img {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}
.achievement-text h3 {
  margin: 0;
  font-size: 1rem;
  color: #ffd700;
}
.achievement-text p {
  margin: 0.25rem 0 0 0;
  font-weight: bold;
}
.achievement-text small {
  display: block;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #e0d0c1;
}
.achievement-popup-enter-active,
.achievement-popup-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.achievement-popup-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.achievement-popup-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.achievement-popup-enter-to,
.achievement-popup-leave-from {
  opacity: 1;
  transform: translateX(0);
}
.ending-popup-enter-active,
.ending-popup-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.ending-popup-enter-from,
.ending-popup-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
.ending-popup-enter-to,
.ending-popup-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
