import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { type SensorsTypes, type Axis } from './store';

export interface Card {
  id: string;
  activeSensor: string;
  activeSample: SensorsTypes;
  vector?: boolean;
  axi?: Axis;
}

interface UpdateCard {
  activeSensor?: string;
  activeSample?: SensorsTypes;
  vector?: boolean;
  axi?: Axis;
}

export const useCardStore = defineStore('cards', () => {
  const cards = ref<Card[]>([]);

  const addCard = () => {
    if (cards.value.length >= 10) return;

    cards.value.push({
      id: uuidv4(),
      activeSensor: '',
      activeSample: 'new',
    });
  };

  const removeCard = (id: string) => {
    if (cards.value.length < 1) return;
    const index = cards.value.findIndex((card) => card.id === id);
    cards.value.splice(index, 1);
  };

  const cardLImitReached = () => {
    return cards.value.length >= 10;
  };

  function updateCard(id: string, card: UpdateCard) {
    const index = cards.value.findIndex((card) => card.id === id);
    cards.value[index] = { ...cards.value[index], ...card };
  }

  return {
    cards,
    addCard,
    removeCard,
    cardLImitReached,
    updateCard,
  };
});
