// composables/usePlant.ts
import { ref } from 'vue'

// Načíst uloženou rostlinu nebo výchozí 'trees'
const loadSavedPlant = () => {
    const saved = localStorage.getItem('wbi-klikacka-plant');
    return saved || 'trees';
};

export const selectedPlant = ref(loadSavedPlant());
export const isChoosingPlant = ref(!localStorage.getItem('wbi-klikacka-plant'));

// Funkce pro uložení vybrané rostliny
export const savePlantSelection = (plant: string) => {
    selectedPlant.value = plant;
    isChoosingPlant.value = false;
    localStorage.setItem('wbi-klikacka-plant', plant);
};

// Funkce pro reset hry (vrátí na výběr rostliny)
export const resetPlantSelection = () => {
    isChoosingPlant.value = true;
    localStorage.removeItem('wbi-klikacka-plant');
};