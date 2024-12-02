import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

import { useCardStore } from './storeCards';

export type SensorsTypes =
  | 'accel'
  | 'gyro'
  | 'magnet'
  | 'temp'
  | 'humi'
  | 'new';

export type Axis = 'x' | 'y' | 'z';
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
  value: {
    [key in Axis]: number;
  };
  unit: string;
  vector: true;
}
export type SensorData = { [key in SensorsTypes]: SimpleData | VectorData } & {
  time: number;
};

interface Data {
  [key: string]: SensorData;
}

interface RecordedData {
  [key: string]: {
    [key in SensorsTypes]?: [number, number][];
  };
}

export interface Experiment {
  id: string;
  name: string;
  description: string;
  cards: Record<string, any>[];
  date: string;
  recordings: Recording[];
  snapshots: Record<string, SensorData>[];
  texts: Record<string, string>;
  images: Record<string, string>;
}

export interface Recording {
  id: string;
  snapshots: Record<string, SensorData>[];
  date: string;
  data: RecordedData;
}

export const useStore = defineStore('sensors', () => {
  const cardStore = useCardStore();

  const sensors = ref<Record<string, Sensor[]>>({
    device1: [
      {
        id: 'sensor1',
        name: 'Accelerometer Sensor',
        device_id: 'device1',
        type: 'accelerometer',
        unit: 'm/s2',
        inUse: false,
        key: 'accel',
        vector: true,
      },
    ],
    device2: [
      {
        id: 'sensor2',
        name: 'Temperature Sensor',
        device_id: 'device2',
        type: 'temperature',
        unit: 'Celsius',
        inUse: false,
        key: 'temp',
        vector: false,
      },
      {
        id: 'sensor3',
        name: 'Humidity Sensor',
        device_id: 'device2',
        type: 'humidity',
        unit: '%',
        inUse: false,
        key: 'humi',
        vector: false,
      },
    ],
  });

  const selectedExperiment = ref<Experiment | null>(null);

  const data = ref<Data>({});
  const recording = ref(false);

  const recordedData = ref<RecordedData>({});

  const addSensor = (sensor: Sensor) => {
    // sensors.value.push(sensor);
  };

  function startRecording() {
    recording.value = true;
  }

  function stopRecording() {
    recording.value = false;
  }

  function setData(id: string, newData: SensorData) {
    data.value[id] = newData;
    // check if simple or vector data
    if (recording.value) {
      if (!recordedData.value[id]) {
        recordedData.value[id] = {};
      }
      cardStore.cards.map((card) => {
        if (card.activeSensor === id) {
          if (!recordedData.value[id][card.activeSample]) {
            recordedData.value[id][card.activeSample] = [];
          }

          const sampleData = newData[card.activeSample];
          let tempData: [number, number] = [0, 0];
          if (card.vector && 'value' in sampleData) {
            const temp = sampleData as VectorData;
            tempData = [temp.value[card.axi!], newData.time];
          } else if ('value' in sampleData) {
            tempData = [(sampleData as SimpleData).value, newData.time];
          }
          recordedData.value[id][card.activeSample]!.push(tempData);
        }
      });
    }
  }

  const getData = computed(() => data.value);

  function changeSensorInUse(
    deviceId: string,
    sensorId: string,
    prevDevice: string,
    prevSensor: string
  ) {
    if (deviceId != '' || sensorId != '') {
      const sensor = sensors.value[deviceId].find(
        (sensor) => sensor.id === sensorId
      );
      if (sensor) {
        sensor.inUse = true;
      }
    }

    if (prevDevice == '' || prevSensor == '') return;

    const prevSensorObj = sensors.value[prevDevice].find(
      (sensor) => sensor.id === prevSensor
    );
    if (prevSensorObj) {
      prevSensorObj.inUse = false;
    }
  }

  function allInUse() {
    return Object.values(sensors.value).every((device) =>
      device.every((sensor) => sensor.inUse)
    );
  }

  return {
    sensors,
    data,
    selectedExperiment,
    recording,
    recordedData,
    addSensor,
    setData,
    getData,
    changeSensorInUse,
    allInUse,
    startRecording,
    stopRecording,
  };
});
