import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { useCardStore } from './storeCards';

export type SensorsTypes = 'accel' | 'gyro' | 'magnet' | 'temp' | 'humi';

interface Sensor {
  id: string;
  name: string;
  device_id: string;
  type: string;
  unit: string;
  inUse: boolean;
  key: SensorsTypes;
  vector: boolean;
}

interface SimpleData {
  value: number;
  unit: string;
  vector: false;
}

interface VectorData {
  value: { x: number; y: number; z: number };
  unit: string;
  vector: true;
}

export type SensorData = { [key in SensorsTypes]: SimpleData | VectorData };

interface Data {
  [key: string]: SensorData;
}

export const useStore = defineStore('sensors', () => {
  const cardStore = useCardStore();

  const sensors = ref<Record<string, Sensor>>({
    device2: {
      id: 'device2',
      name: 'Temperature Sensor',
      device_id: 'dev_01',
      type: 'temperature',
      unit: 'Celsius',
      inUse: false,
      key: 'temp',
      vector: false,
    },
    device1: {
      id: 'device1',
      name: 'Accelerometer Sensor',
      device_id: 'dev_03',
      type: 'accelerometer',
      unit: 'm/s2',
      inUse: false,
      key: 'accel',
      vector: true,
    },
  });

  const data = ref<Data>({});
  const recording = ref(false);

  const recordedData = ref<Record<string, Data[]>>({});

  const addSensor = (sensor: Sensor) => {
    // sensors.value.push(sensor);
  };

  function setData(id: string, newData: SensorData) {
    data.value[id] = newData;
    // check if simple or vector data
    if (recording.value) {
      cardStore.cards;
    }
  }

  const getData = computed(() => data.value);

  return {
    sensors,
    data,
    addSensor,
    setData,
    getData,
  };
});
