<script lang="ts" setup>
import uPlot from 'uplot';
import { useTheme } from 'vuetify';

import { computed, onMounted, ref, watch, WatchHandle, onBeforeUnmount } from 'vue';

import { useStore, type SensorData, type SensorsTypes, type Axis } from '@/store/store';
import { Card, useCardStore } from '@/store/storeCards';

const props = defineProps<{
  card: Card;
}>();


const theme = useTheme();
const store = useStore();
const storeCard = useCardStore();

let mounted = false;

interface Device {
  device: string, key: SensorsTypes; id: string; title: string; vector: boolean;
}

const axis = ref<string>('x');
const selected = ref<SensorsTypes>('temp');

let watcher: WatchHandle | null = null;

const el = ref<HTMLElement>();
const cardDiv = ref<HTMLElement>();
const uplot = ref<uPlot>();
const data: uPlot.AlignedData = [
  [],    // x-values (timestamps)
  [],    // y-values (series 1)
];

const devices = computed(() => {
  return Object.keys(store.sensors).map((device) => {
    return store.sensors[device].map((sensor) => {
      return {
        value: {
          device,
          key: sensor.key,
          id: sensor.id,
          title: sensor.name,
          vector: sensor.vector,
        },
        title: sensor.name,
        inUse: sensor.inUse,
      };
    });
  }).flat().filter((sensor) => !sensor.inUse);
});

const device = ref<Device>(devices.value[0].value);
store.changeSensorInUse(device.value.device, device.value.id, '', '');

watch(() => [axis.value, device.value], () => {
  // find card in store and update it
  const cardInStore = storeCard.cards.find(c => c.id === props.card.id);
  const newCard = {
    axi: axis.value as Axis,
    activeSensor: device.value.device,
    activeSample: device.value.key,
    vector: device.value.vector,
  };
  if (cardInStore) {
    storeCard.updateCard(props.card.id, newCard);
  }
}, { deep: true, immediate: true });

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
  ...getSize(),
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

function getSize() {
  return {
    //@ts-ignore next-line
    width: cardDiv.value ? cardDiv.value!.$el.clientWidth : 500,
    height: 200,
  }
}

function startWatcher() {
  watcher = watch(() => store.data[device.value.device], (newData: SensorData) => {
    if (mounted) {

      const sensor = store.sensors[device.value.device].find((s) => s.id === device.value.id)!;
      try {

        if (sensor.vector) {

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
      } catch (e) {
        console.error(e);
      }
    }
  }, { deep: true });
}

watch(() => device.value, (newVal, oldVal) => {
  selected.value = newVal.key;
  if (watcher) {
    watcher();
    data[0] = [];
    data[1] = [];
  }

  store.changeSensorInUse(newVal.device, newVal.id, oldVal.device, oldVal.id);

  startWatcher()
});

watch(() => theme.global.current.value.dark, () => {
  uplot.value?.redraw(false)
});


onMounted(() => {
  uplot.value = new uPlot(opts, data, el.value);

  mounted = true;
  startWatcher()

  window.addEventListener('resize', () => {
    uplot.value?.setSize(getSize());
  });
  console.log(getSize());
})

onBeforeUnmount(() => {
  if (watcher) {
    watcher();
  }

  store.changeSensorInUse('', '', device.value.device, device.value.id);

  window.removeEventListener('resize', () => {
    uplot.value?.setSize(getSize());
  });
});

function removeCard() {
  storeCard.removeCard(props.card.id);
}
</script>

<template>
  <v-card class="card" ref="cardDiv">
    <v-toolbar color="primary" class="toolbar d-flex flex-column ">
      <div class="d-flex  w-100 px-2 ga-1 align-center">

        <v-toolbar-title>Graph</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-select :disabled="store.recording" :items="[{ value: device, title: device.title }, ...devices]"
          label="Device" density="compact" hide-details variant="outlined" flat width="40%" item-value="value"
          item-title="title" v-model="device"></v-select>
        <v-btn @click.stop="removeCard" icon="mdi-delete" :disabled="store.recording"></v-btn>
      </div>
      <div>

      </div>
    </v-toolbar>
    <v-card-item color="secondary" width="100%">
      <div ref="el"></div>
    </v-card-item>
  </v-card>
</template>

<style scoped>
.card {
  max-width: 500px;
  min-width: 300px;

  max-height: 400px;
}

.toolbar {
  padding-right: 5px;
}
</style>