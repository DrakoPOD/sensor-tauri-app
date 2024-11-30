<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { create, readDir, BaseDirectory, readTextFile } from '@tauri-apps/plugin-fs';

import ExperimentCard from '@/components/ExperimentCard.vue';

const experiments = ref<Record<string, string>[]>([]);

const testExperiment = {
  name: 'Test Experiment',
  description: 'This is a test experiment',
  sensors: [
    {
      name: 'Temperature',
      key: 'temp',
      inUse: true,
    },
    {
      name: 'Humidity',
      key: 'hum',
      inUse: true,
    },
  ],
}

async function createNewExperiment() {
  const fileName = new Date().toISOString().replace(/:/g, '-').replace(/\./g, '-');
  //@ts-ignore
  const file = await create(`experiments/experiment-${fileName}.json`, { baseDir: BaseDirectory.AppLocalData });
  await file.write(new TextEncoder().encode(JSON.stringify(testExperiment)));
  await file.close();
}

async function findExperiments() {
  const files = await readDir('experiments', { baseDir: BaseDirectory.AppLocalData });

  for (const file of files.filter(file => file.isFile)) {
    const experiment = await readTextFile(`experiments/${file.name}`, { baseDir: BaseDirectory.AppLocalData });

    experiments.value.push(JSON.parse(experiment));
  }
}

onMounted(async () => {
  await findExperiments();
});
</script>

<template>
  <v-row>
    <v-col v-for="experiment in experiments" :key="experiment.name">
      <ExperimentCard :title="experiment.name" :description="experiment.description" />
    </v-col>
  </v-row>
  <v-btn @click="createNewExperiment()">Create Experiment</v-btn>
</template>