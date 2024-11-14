import mqtt from 'mqtt';

import { useStore } from '@/store/store';

const client = mqtt.connect('ws://localhost:8083/mqtt');

export const startMqtt = () => {
  const store = useStore();

  client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('sensor/#');

    setInterval(() => {
      client.publish(
        'sensor/device1',
        `{"accel":{"value":{"x":${Math.random() * 9.8},"y":${
          Math.random() * 9.8
        },"z":${Math.random() * 9.8}},"unit":"m/s2", "vector":true}}`,
        { qos: 0, retain: false }
      );

      client.publish(
        'sensor/device2',
        `{"temp":{"value":${Math.random() * 40},"unit":"°", "vector":false}}`,
        { qos: 0, retain: false }
      );
    }, 1000);
  });

  client.on('message', (topic, message) => {
    // console.log('received message %s %s', topic, message);

    const [_, device] = topic.split('/');
    try {
      const data = JSON.parse(message.toString());
      // console.log('data', data);

      store.setData(device, data);
    } catch (e) {
      console.error('error parsing message', e);
    }
  });
};
export const useMqtt = () => {
  return { client };
};
