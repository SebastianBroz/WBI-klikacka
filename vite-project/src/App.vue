<!--Vyuzito ChatGPT pro obrazky, inspiraci a vice:
https://chatgpt.com/share/69998f74-342c-8002-94fd-e8ed5e74cbb0
https://chatgpt.com/share/69998fa0-ba34-8002-a4b1-b2f852251980
https://chatgpt.com/share/69998fad-e954-8002-b2b8-4c591f545872
-->

<script setup lang="ts">
import ChoosePlant from './components/ChoosePlant.vue';
import Field from './components/Field.vue';
import Offer from './components/Offer.vue';
import Perk from './components/Perk.vue';
import Achievement from './components/Achievement.vue'
import Ending from './components/Ending.vue';
</script>

<template>
  <!--<HelloWorld msg="Vite + Vue" />-->
    <div class="container">
      <main>
        <!--<ChoosePlant />-->
        <!--<Ending />-->
            <section class="countAndField">
              <div class="currencyCount">
                <img src="../public/tree_grown.png">
                <p>--var</p>
              </div>
              <div class="timePerClick">
                <img src="../public/clock_tpc.png">
                <p>Time per click: --var</p>
              </div>
              <div class="fields">
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
                <Field />
              </div>
            </section>
            <section class="optionsAndLogo">
              <section class="options">
                      <div class="optionsMenu">
                          <button>SHOP</button>
                          <button>PERKS</button>
                          <button>ACHIEVEMENTS</button>
                      </div>
                      <!--<ul class="shopOffers">
                        <Offer />
                        <Offer />
                        <Offer />
                        <Offer />
                        <Offer />
                      </ul>-->
                      <!--<ul class="perksList">
                        <Perk />
                        <Perk />
                        <Perk />
                        <Perk />
                        <Perk />
                      </ul>-->
                      <ul class="achievementsList">
                        <Achievement />
                        <Achievement />
                        <Achievement />
                        <Achievement />
                        <Achievement />
                      </ul>
                    </section>
                    <img src="../public/logo_pixel.png" alt="logo" />
            </section>
          </main>
    </div>
</template>

<style scoped>
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
.container {
  width: 100%;
  height: 100vh;
  background-color: rgba(224, 208, 193, 0.458);
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
.countAndField {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
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
}
.currencyCount img {
  height: 2rem;
}
.timePerClick {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5em;
  padding: 0.5rem 1rem;
  background-color: #00a676;
  color: #f7f9f9;
  border-radius: 2rem;
}
.timePerClick img {
  height: 2rem;
}
.fields {
  display: grid;
  /* each column is at least 5rem but will expand to fill available space evenly */
  grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
  gap: 0.5rem;
  background-image: url('../public/grass_2.png');
  background-size: cover;
  border-radius: 1rem;
  padding: 1rem;
  width: 100%;
}
.timeBar
{
  width: 80%;
  height: 0.5rem;
  border: 2px solid #e0d0c1;
  background-color: #f7f9f9;
  border-radius: 0.25rem;
}
.options {
  display: flex;
  flex-direction: column;
  max-width: 50rem;
}
.optionsAndLogo {
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
.shopOffers
{
  border: 5px solid #601700;
  overflow: auto;
  max-height: 34rem;
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
  background-color: #601700;
  color: #f7f9f9;
  border: none;
}
.optionsMenu button:hover {
  background-color: #942301;
}
/*.optionsMenu button:active {
  background-color: #942301;
}*/
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
footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
@media (min-width: 320px) and (max-width: 768px) {
  main {
    flex-direction: column;
    padding-inline: 1rem;
    gap: 1rem;
  }
  .currencyCount, .timePerClick {
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
