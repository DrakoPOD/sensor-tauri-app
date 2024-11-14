<script setup lang="ts">
import GraphCard from '@/components/GraphCard.vue';

import { ref } from 'vue';

import { useCardStore } from '@/store/storeCards';

const storeCards = useCardStore();
</script>

<template>
  <v-row>
    <v-col v-for="card, i in storeCards.cards" :key="i">
      <GraphCard :card />
    </v-col>
  </v-row>

</template>