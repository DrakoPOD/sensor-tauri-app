<script lang="ts" setup>
import uPlot from 'uplot';
import { useTheme } from 'vuetify';

import { computed, onMounted, ref, watch, WatchHandle, } from 'vue';

import { useStore, SensorData, SensorsTypes } from '@/store/store';
import { Card, useCardStore } from '@/store/storeCards';

const props = defineProps<{
  card: Card;
}>();


const theme = useTheme();
const store = useStore();
const storeCard = useCardStore();

let mounted = false;

interface Device {
  device: string, key: SensorsTypes;
}



const device = ref<Device>({ device: 'device2', key: 'temp' });
const axis = ref<string>('x');
const selected = ref<SensorsTypes>('temp');

let watcher: WatchHandle | null = null;

const el = ref<HTMLElement>();
const uplot = ref<uPlot>();
const data: uPlot.AlignedData = [
  [],    // x-values (timestamps)
  [],    // y-values (series 1)
];

watch(() => [axis.value, device.value, selected.value], () => {
  // find card in store and update it
  const cardInStore = storeCard.cards.find(c => c.id === props.card.id);
  const newCard = {
    axi: axis.value,
    activeSensor: device.value.device,
    activeSample: selected.value,
  };
  if (cardInStore) {
    storeCard.updateCard(props.card.id, newCard);
  }
}, { deep: true, immediate: true });

const devices = computed(() => Object.keys(store.sensors).map((key) => ({ value: { device: key, key: store.sensors[key].key }, title: store.sensors[key].name })));

const opts: uPlot.Options = {
  title: "My Chart",
  id: "chart1",
  class: "my-chart",
  legend: { show: false },
  axes: [
    {
      show: false,
      stroke: "rgb(0,0,0,0)",
      grid: { stroke: "rgb(0,0,0,0)" },
      ticks: { stroke: "rgb(0,0,0,0)" },
    },
    {
      stroke: () => theme.global.current.value.dark ? "#fff" : "rgb(0,0,0,1)",
      grid: { stroke: () => theme.global.current.value.dark ? "rgb(255,255,255,.2)" : "rgb(0,0,0,.2)" },
      ticks: { stroke: () => theme.global.current.value.dark ? "rgb(255,255,255,.2)" : "rgb(0,0,0,.2)" },
    },
  ],
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
      // fill: "rgba(255, 0, 0, 0.3)",
      dash: [10, 5],
    },
  ],
};

function startWatcher() {
  watcher = watch(() => store.data[device.value.device], (newData: SensorData) => {
    if (mounted) {

      if (store.sensors[device.value.device].vector) {

        (data[0] as Array<number>).push(new Date().getTime());
        const value = newData[device.value.key].value;
        if (typeof value === 'object' && 'x' in value && 'y' in value && 'z' in value) {
          (data[1] as Array<number>).push(value[axis.value as 'x' | 'y' | 'z']);
        }
      } else {
        (data[0] as Array<number>).push(new Date().getTime());
        (data[1] as Array<number>).push(newData[device.value.key].value as number);
      }
      uplot.value!.setData(data);
    }
  }, { deep: true });
}

watch(() => device.value, (newVal) => {
  selected.value = newVal.key;
  console.log(selected.value);
  if (watcher) {
    watcher();
    data[0] = [];
    data[1] = [];
  }


  startWatcher()
});

watch(() => theme.global.current.value.dark, () => {
  uplot.value?.redraw(false)
});


onMounted(() => {
  uplot.value = new uPlot(opts, data, el.value);

  mounted = true;
  startWatcher()
  // setInterval(async () => {
  //   const temp = await invoke<[number, number, number, number]>('random_data');
  //   (data[0] as Array<number>).push(temp[0]);
  //   (data[1] as Array<number>).push(temp[1]);
  //   (data[2] as Array<number>).push(temp[2]);
  //   (data[3] as Array<number>).push(temp[3]);

  //   uplot.value!.setData(data);
  // }, 1000);
})

function removeCard() {
  storeCard.removeCard(props.card.id);
}
</script>

<template>
  <v-card class="card">
    <v-toolbar color="primary" class="toolbar d-flex flex-column ">
      <div class="d-flex  w-100 px-2 ga-1 align-center">

        <v-toolbar-title>Graph</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-select :items="devices" label="Device" density="compact" hide-details variant="outlined" flat width="40%"
          item-value="value" item-title="title" v-model="device"></v-select>
        <v-btn @click.stop="removeCard" icon="mdi-delete"></v-btn>
      </div>
      <div>

      </div>
    </v-toolbar>
    <v-card-item color="secondary">
      <div ref="el"></div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.card {
  width: 500px;
}

.toolbar {
  padding-right: 5px;
}
</style>