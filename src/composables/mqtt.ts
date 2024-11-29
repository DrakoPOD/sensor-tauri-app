import mqtt, { type MqttClient } from 'mqtt';

import { useStore } from '@/store/store';

export const startMqtt = (host: string) => {
  const client = mqtt.connect(host);

  const store = useStore();

  client.on('connect', () => {
    console.log('mqtt connected');
    client.subscribe('sensor/#');

    let currentMilis = new Date().getTime();

    setInterval(() => {
      let milis = new Date().getTime() - currentMilis;

      client.publish(
        'sensor/device1',
        `{"accel":{"value":{"x":${Math.random() * 9.8},"y":${
          Math.random() * 9.8
        },"z":${
          Math.random() * 9.8
        }},"unit":"m/s2", "vector":true}, "time": ${milis}}`,
        { qos: 0, retain: false }
      );

      client.publish(
        'sensor/device2',
        `{"temp":{"value":${
          Math.random() * 40
        },"unit":"°", "vector":false}, "humi":{"value":${
          Math.random() * 100
        },"unit":"%", "vector":false}, "time": ${milis}}`,
        { qos: 0, retain: false }
      );

      currentMilis = new Date().getTime();
    }, 100);
  });

  client.on('message', (topic, message) => {
    const [_, device] = topic.split('/');
    try {
      const data = JSON.parse(message.toString());

      store.setData(device, data);
    } catch (e) {
      console.error('error parsing message', e);
    }
  });

  return client;
};
