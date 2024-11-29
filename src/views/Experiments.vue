<script setup lang="ts">
import { onMounted } from 'vue';
import { create, BaseDirectory } from '@tauri-apps/plugin-fs';


async function createNewExperiment() {
  const fileName = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  //@ts-ignore
  const file = await create(`experiments/experiment${fileName}.json`, { baseDir: BaseDirectory.AppLocalData });
  await file.write(new TextEncoder().encode(JSON.stringify({})));
  await file.close();
}

onMounted(() => {

});
</script>

<template>
  <v-btn @clic="createNewExperiment()">Create Experiment</v-btn>
</template>