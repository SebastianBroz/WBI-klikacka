<!--Vyuzito ChatGPT pro obrazky, inspiraci a vice a Claude:
https://chatgpt.com/share/69998f74-342c-8002-94fd-e8ed5e74cbb0
https://chatgpt.com/share/69998fa0-ba34-8002-a4b1-b2f852251980
https://chatgpt.com/share/69998fad-e954-8002-b2b8-4c591f545872
https://claude.ai/share/fd8cab84-7071-4043-ae01-7f617112934a
-->

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue';
import ChoosePlant from './components/ChoosePlant.vue';
import Field from './components/Field.vue';
import Offer from './components/Offer.vue';
import Perk from './components/Perk.vue';
import Achievement from './components/Achievement.vue'
import Ending from './components/Ending.vue';
import { useCounterStore } from "./stores/counter.ts"
import Audio from "./components/Audio.vue"
import { selectedPlant, isChoosingPlant } from './composables/usePlant'
import { activeEvent, eventTimeRemaining } from './composables/useEvents'

const store = useCounterStore();

const currentSection = ref('shopOffers');
const endingDismissed = ref(false);

const changeSection = (section: string) => {
  currentSection.value = section;
};

const endingAchievements: Record<string, { title: string; description: string; img: string }> = {
  trees: {
    title: 'Forest Ending',
    description: 'You filled the planet with trees and saved humanity from extinction!',
    img: '/pics/achievement_forest_ending.png',
  },
  mushrooms: {
    title: 'Zombie Ending',
    description: 'The mycelium consumed all life on Earth. All intelligent life ceased to exist.',
    img: '/pics/achievement_mushroom_ending.png',
  },
  potatoes: {
    title: 'Potato Ending',
    description: 'You ended world hunger and buried the planet in potatoes. Congrats, I guess.',
    img: '/pics/achievement_potato_ending.png',
  },
};

const cropMilestoneAchievements: Record<string, { title: string; description: string; img?: string }> = {
  trees: {
    title: 'Arboreal Giant',
    description: 'Harvested 10,000 trees. The forest is flourishing!',
  },
  mushrooms: {
    title: 'Mycelium Master',
    description: 'Harvested 10,000 mushrooms. The fungal empire grows strong!',
  },
  potatoes: {
    title: 'Potato Tycoon',
    description: 'Harvested 10,000 potatoes. You are the king of tubers!',
  },
};

const pesticideMilestoneAchievement = {
  title: 'Bug Killing Professional',
  description: 'Purchased pesticides five times. Your crops are well defended!',
};

const pesticideInvestorAchievement = {
  title: 'Long Term Investor',
  description: 'Purchased pesticides fifteen times. You are investing heavily in crop protection!',
};

const fertilizerMilestoneAchievement = {
  title: 'Getting Ready For Take Off!',
  description: 'Purchased fertilizers three times. Your yields are multiplying exponentially!',
};

const fertilizerMasterAchievement = {
  title: 'TO THE MOON!',
  description: 'Purchased fertilizers ten times. Your crops are supercharged!',
};

watch(() => store.count, (count) => {
  if (count >= 10) {
    const achievement = endingAchievements[selectedPlant.value];
    if (achievement) {
      store.addAchievement(achievement);
    }
  }
  if (count >= 10000) {
    const milestoneAchievement = cropMilestoneAchievements[selectedPlant.value];
    if (milestoneAchievement) {
      store.addAchievement(milestoneAchievement);
    }
  }
});

watch(() => store.pesticideLevel, (level) => {
  if (level >= 5) {
    store.addAchievement(pesticideMilestoneAchievement);
  }
    if (level >= 15) {
    store.addAchievement(pesticideInvestorAchievement);
  }
});

watch(() => store.fertilizerLevel, (level) => {
  if (level >= 3) {
    store.addAchievement(fertilizerMilestoneAchievement);
  }
  if (level >= 10) {
    store.addAchievement(fertilizerMasterAchievement);
  }
});

const DAY_DURATION   = 1  // seconds
const RAIN_DURATION  = 30   // seconds
const INSECT_DISPLAY = 30   // seconds (deduction is instant, display lingers)

let dayTimer: ReturnType<typeof setTimeout> | null = null
let eventTimer: ReturnType<typeof setTimeout> | null = null
let countdownInterval: ReturnType<typeof setInterval> | null = null
let pesticideInterval: ReturnType<typeof setInterval> | null = null

const pesticideTick = ref(Date.now())
const pesticideTimeRemaining = computed(() => {
  const remaining = store.pesticideExpiry - pesticideTick.value
  if (remaining <= 0) return null
  const s = Math.ceil(remaining / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
})

const startCountdown = (seconds: number) => {
  eventTimeRemaining.value = seconds
  if (countdownInterval) clearInterval(countdownInterval)
  countdownInterval = setInterval(() => {
    eventTimeRemaining.value--
    if (eventTimeRemaining.value <= 0) {
      activeEvent.value = null
      clearInterval(countdownInterval!)
    }
  }, 1000)
}

const scheduleDayEvents = () => {
  if (Math.random() < 0.5) {
    const delay = Math.floor(Math.random() * DAY_DURATION * 1000)
    const type = Math.random() < 0.5 ? 'rain' : 'insect_attack'
    eventTimer = setTimeout(() => {
      if (activeEvent.value !== null) return
      if (type === 'insect_attack' && Date.now() < store.pesticideExpiry) return
      if (type === 'insect_attack') store.applyInsectAttack()
      activeEvent.value = type
      startCountdown(type === 'rain' ? RAIN_DURATION : INSECT_DISPLAY)
    }, delay)
  }
  dayTimer = setTimeout(() => scheduleDayEvents(), DAY_DURATION * 1000)
}

const countdownDisplay = computed(() => {
  const s = eventTimeRemaining.value
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
})

onMounted(() => {
  scheduleDayEvents()
  pesticideInterval = setInterval(() => { pesticideTick.value = Date.now() }, 1000)
})
onUnmounted(() => {
  if (dayTimer) clearTimeout(dayTimer)
  if (eventTimer) clearTimeout(eventTimer)
  if (countdownInterval) clearInterval(countdownInterval)
  if (pesticideInterval) clearInterval(pesticideInterval)
})
</script>

<template>
  <div class="container">
    <main>
      <ChoosePlant v-if="isChoosingPlant"/>
      <Ending v-if="store.count >= 10 && !endingDismissed" @close="endingDismissed = true"/>
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
            <div class="pesticideTimer" v-if="pesticideTimeRemaining">
              <img src="" style="pointer-events: none;">
              <p>Pesticide: {{ pesticideTimeRemaining }}</p>
            </div>
            <div class="treesPerClick">
              <img src="/pics/clock_tpc.png" style="pointer-events: none;">
              <p>{{ selectedPlant.charAt(0).toUpperCase() + selectedPlant.slice(1) }} per click: {{ Math.round(store.fertilizerMultiplier) }}</p>
            </div>
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
              <!-- Conditional rendering based on currentSection -->
              <ul v-if="currentSection === 'shopOffers'" class="shopOffers">
                <Offer
                  title="Fertilizer"
                  description="Triples crop yield per harvest. Price multiplies by 50 each purchase."
                  img="/placeholder.jpeg"
                  :cost="store.fertilizerCost"
                  :canAfford="store.count >= store.fertilizerCost"
                  @buy="store.buyFertilizer()"
                />
                <Offer
                  title="Pesticides"
                  description="Prevents insect attacks for 5 hours. Price multiplies by 3 each purchase."
                  img="/placeholder.jpeg"
                  :cost="store.pesticideCost"
                  :canAfford="store.count >= store.pesticideCost"
                  @buy="store.buyPesticide()"
                />
              </ul>
              <ul v-if="currentSection === 'perksList'" class="perksList">
                <Perk 
                  v-for="n in 5" 
                  :key="n" 
                  title="title" 
                  description="desc" 
                  img="/pics/perk_rainstorm.png"  />
              </ul>
              <ul v-if="currentSection === 'achievements'" class="achievementsList">
                <Achievement
                  v-for="achievement in store.achievements"
                  :key="achievement.title"
                  :title="achievement.title"
                  :description="achievement.description"
                  :img="achievement.img"
                />
                <li v-if="store.achievements.length === 0" class="noAchievements">No achievements yet. Keep playing!</li>
              </ul>
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
template{
  height: 100%;
}
.container {
  font-family: "Jersey 10", sans-serif;
  letter-spacing: 10%;
  max-width: 100%;
  height: 100vh;
  background-color: #e0d0c1;
  background-image: url(/pics/sky_bg.png);
  background-size: cover;
  padding-block: 0.75rem;
}
img {
  height: 4rem;
}
main {
  display: flex;
  gap: 4rem;
  padding-inline: 3rem;
}
.stats {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 100vh;
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
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
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
footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
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
</style>
