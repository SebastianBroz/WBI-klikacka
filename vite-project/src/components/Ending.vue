<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)
</script>
<!--SPOILERY !!! XD-->
<template>
  <div class="shadow">
    <div class="endingPopup">
      <p>Forest ending</p>
      <p>The planet is filled to the brim with plant life you helped to create. Nature is flourishing and the trees you have grown produce enough oxygen that oxygen-bank companies started to form and began working with NASA that plans on exporting oxygen to other planets to supply their bases. Mental and physical health is at an all time high, people spend time in the nature watching birds and other animal species which have grown in numbers as well. Apart from the amazing scenery that covers the planet everywhere the eye can see (even in the cities!) you managed to save humanity from extinction level threats that were the global warming, deforestation and plant-life resource shortage. Humanity celebrates you and builds statues of you. Life on Earth is not just surviving but thriving! Everybody thanks you for saving the planet, hero.</p>
      <img src="/forest_ending.png">
    </div>
    <!--<div class="endingPopup">
      <p>Zombie ending</p>
      <p>You managed to produce so much mushrooms that the entire planet is rooted with mycelium through and through. The mycelium became alive as one planetary-sized organism connected on every end. Mushrooms became the only living plant organism on Earth and soon grew into unimaginable sizes similar to those of trees. Humans werent safe on Earth anymore - few hundred of them escaped to Mars before the zombification began. The mycelium spread into homes and into living as well as dead bodies of humans and animals and took over their minds. Those whom survived on Mars gave the tragedy a name - The Spread. All inteligent life on Earth ceased to exist due to this catastrophy thanks to you, monster.</p>
      <img src="/zombie_ending.png">
    </div>-->
    <!--<div class="endingPopup">
      <p>Potato ending</p>
      <p>You poured your blood, sweat and tears into producing as many potatoes as possible and humanity is... ok with it? News report human complaints about the amount of potatoes the world is almost drowning in - reporters say they are sick of seeing potatoes everywhere. Potato chips, fried potatoes, potato soup, potatoes as gym weight, potato roads, potato statues, ... they are just everywhere. Some people though seem satisfied since you have single-handedly ended world hunger and there will always be enough food supplies in the future. NASA started sending rockets filled with potato cargo to Mars and the Moon to "clean up and supply the future inhabitants of these neighbouring celestial bodies". Generally you have succeeded in satysfying and disheartening the people on Earth... so congrats I guess, human.</p>
      <img src="/potato_ending.png">
    </div>-->
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
.endingPopup {
  width: 50rem; height: 33rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-image: url('../public/ending_bg.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  box-sizing: border-box;
}
.endingPopup p:first-child {
  color: #f7f9f9;
  font-size: 1.5em;
  text-align: center;
}
.endingPopup p:nth-child(2) {
  color: #f7f9f9;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.75rem;
} 
.endingPopup img {
  width: 20rem;
  cursor: pointer;
}
.endingPopup img:hover {
  background-color: #f7f9f96e;
}
</style>
