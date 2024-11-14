<script lang="ts" setup>
import { ref } from 'vue';
import { startMqtt } from '@/composables/mqtt';
import { useTheme } from 'vuetify';

import GraphView from '@/views/GraphView.vue';

import { useCardStore } from './store/storeCards';

const theme = useTheme();
const drawer = ref(false);


startMqtt();

const storeCard = useCardStore();

function addCard() {
  storeCard.addCard();
}

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
}

</script>

<template>
  <v-responsive>
    <v-app>

      <v-app-bar title="My App">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-spacer></v-spacer>
        <v-btn @click="toggleTheme" icon>
          <v-icon>{{ theme.global.current.value.dark ? 'mdi-moon-waning-crescent' : 'mdi-weather-sunny' }}</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer">
        <v-list>
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-container>
          <GraphView />
        </v-container>
      </v-main>
      <v-footer elevation="10" class="action-bar" app>
        <v-btn :disabled="storeCard.cardLImitReached()" @click="addCard" icon="mdi-thermometer-plus"></v-btn>
        <v-btn @click="" icon="mdi-camera-control"></v-btn>
        <v-btn :disabled="storeCard.cards.length < 1" @click="" icon="mdi-record-circle"></v-btn>
        <v-btn @click="" icon="mdi-flag"></v-btn>
      </v-footer>
    </v-app>
  </v-responsive>
</template>

<style scoped>
.action-bar {
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 1rem;
}
</style>