<script lang="ts" setup>
import uPlot from 'uplot';

import { computed, onMounted, ref } from 'vue';

import { invoke } from '@tauri-apps/api/core';

import { useStore } from '@/store/store';
import { title } from 'process';

const store = useStore();

const el = ref<HTMLElement>();
const uplot = ref<uPlot>();
const data: uPlot.AlignedData = [
  [],    // x-values (timestamps)
  [],    // y-values (series 1)
  [],    // y-values (series 2)
  []
];

const devices = computed(() => store.sensors.map((s) => ({
  title: s.name,
  value: s.id,
})));

const opts: uPlot.Options = {
  title: "My Chart",
  id: "chart1",
  class: "my-chart",
  legend: { show: false },

  width: 500,
  height: 200,
  series: [
    {
    },
    {
      // initial toggled state (optional)
      show: true,

      spanGaps: false,

      // in-legend display
      label: "RAM",
      // value: (self, rawValue) => "$" + (rawValue).toFixed(2),

      // series style
      stroke: "red",
      width: 1,
      fill: "rgba(255, 0, 0, 0.3)",
      dash: [10, 5],
    }, {
      stroke: "green",
    }, {
      stroke: "blue",
    }
  ],
};

onMounted(() => {
  uplot.value = new uPlot(opts, data, el.value);

  setInterval(async () => {
    const temp = await invoke<[number, number, number, number]>('random_data');
    (data[0] as Array<number>).push(temp[0]);
    (data[1] as Array<number>).push(temp[1]);
    (data[2] as Array<number>).push(temp[2]);
    (data[3] as Array<number>).push(temp[3]);

    uplot.value!.setData(data);
  }, 1000);
})
</script>

<template>
  <v-card>
    <v-toolbar color="blue" title="Bar" density="compact">
      <v-spacer></v-spacer>
      <v-select :items="devices" label="Device" dense></v-select>
    </v-toolbar>
    <v-card-item>
      <div ref="el"></div>
    </v-card-item>
  </v-card>
</template>

<style scoped></style>