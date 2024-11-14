import { defineStore } from 'pinia';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export interface Card {
  id: string;
  activeSensor: string;
  activeSample: string;
  axi?: string;
}

interface UpdateCard {
  activeSensor?: string;
  activeSample?: string;
  axi?: string;
}

export const useCardStore = defineStore('cards', () => {
  const cards = ref<Card[]>([]);

  const addCard = () => {
    if (cards.value.length >= 10) return;

    cards.value.push({
      id: uuidv4(),
      activeSensor: '',
      activeSample: '',
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
