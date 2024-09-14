<script lang="ts" setup>
import WebSocket
  from '@tauri-apps/plugin-websocket';
import { ref } from 'vue';

import GraphCard from './components/GraphCard.vue';

const drawer = ref(false);

async function startClient() {
  let err: string | null = null;

  const ws = await WebSocket.connect('ws://localhost:8080').catch((e) => {
    err = e;
  }) as WebSocket;

  if (err) {
    console.error(err);
    return;
  }

  ws.addListener((msg) => {
    console.log(msg);
  })

  await ws.send('Hello from Vue!');
}

startClient();

</script>

<template>
  <v-responsive>
    <v-app>

      <v-app-bar title="My App">
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>

        <v-spacer></v-spacer>

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
          <h1>Main Content</h1>
          <GraphCard />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

<style></style>