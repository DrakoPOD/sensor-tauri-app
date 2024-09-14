import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Sensor {
  id: string;
  name: string;
  device_id: string;
  type: string;
  unit: string;
  inUse: boolean;
}

export const useStore = defineStore('sensors', () => {
  const sensors = ref<Sensor[]>([
    {
      id: '001',
      name: 'Temperature Sensor',
      device_id: 'dev_01',
      type: 'temperature',
      unit: 'Celsius',
      inUse: false,
    },
    {
      id: '002',
      name: 'Humidity Sensor',
      device_id: 'dev_02',
      type: 'humidity',
      unit: '%',
      inUse: false,
    },
  ]);
  const addSensor = (sensor: Sensor) => {
    sensors.value.push(sensor);
  };
  return {
    sensors,
    addSensor,
  };
});
