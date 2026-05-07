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
import { selectedPlant, isChoosingPlant } from './composables/usePlant'
import { activeEvent } from './composables/useEvents'
import { setupAchievementWatchers } from './composables/useAchievements'
import { setupEventLogic, cleanupEventLogic } from './composables/useEventLogic'
import { useShop } from './composables/useShop'

const store = useCounterStore();

setupAchievementWatchers(store);

const { scheduleDayEvents, countdownDisplay, pesticideTimeRemaining, startPesticideTimer, stopPesticideTimer } = setupEventLogic(store);

const { shopItems } = useShop(store);

const currentSection = ref('shopOffers');
const endingDismissed = ref(false);

const changeSection = (section: string) => {
  currentSection.value = section;
};

onMounted(() => {
  scheduleDayEvents()
  startPesticideTimer()
})
onUnmounted(() => {
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
        <Ending v-if="store.count >= 10 && !endingDismissed" @close="endingDismissed = true"/>
      </Transition>
          <section class="stats">
            <Transition name="event-banner">
              <div class="buffOrNerf" v-if="activeEvent">
                <div class="temporary">
                  <img :src="activeEvent === 'rain' ? '/pics/event_rain.png' : '/pics/event_insect_attack.png'" style="pointer-events: none;">
                  <p>{{ activeEvent === 'rain' ? 'Rainstorm' : 'Insect Attack' }}</p>
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
          <Audio />
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
  background-image: url(/pics/golden_bg.png);
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  border-radius: 0.5rem;
  padding: 0.5rem 2rem;
}
.temporary
{
  display: flex;
  flex-direction: column;
  align-items: center;
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
