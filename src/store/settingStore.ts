import { defineStore } from 'pinia';
import { MqttClient } from 'mqtt';
import { ref } from 'vue';
import { LazyStore } from '@tauri-apps/plugin-store';
import { useTheme } from 'vuetify';

type Theme = 'light' | 'dark';
type V<T> = { value: T };

const store = new LazyStore('settings.json');

export const useSettingStore = defineStore('settings', () => {
  const vTheme = useTheme();

  const mqttHost = ref<string>('');
  const theme = ref<Theme>('light');
  const sessionName = ref<string>('');
  const mqttClient = ref<MqttClient | null>(null);

  async function changeTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    vTheme.global.name.value = theme.value;
    await store.set('theme', { value: theme.value });
    await store.save();
  }

  async function changeHost(host: string) {
    mqttHost.value = host;
    await store.set('mqttHost', { value: host });
    await store.save();
  }

  function setClient(client: MqttClient) {
    mqttClient.value = client;
  }

  async function initializeStore() {
    const storedTheme = await store.get<V<Theme>>('theme');
    const storedHost = await store.get<V<string>>('mqttHost');
    const storedSession = await store.get<V<string>>('sessionName');

    theme.value = storedTheme?.value || 'light';
    mqttHost.value = storedHost?.value || 'ws://localhost:8083/mqtt';
    sessionName.value = storedSession?.value || 'MySession';

    vTheme.global.name.value = theme.value;
  }

  return {
    mqttHost,
    theme,
    sessionName,
    mqttClient,
    changeTheme,
    changeHost,
    initializeStore,
    setClient,
  };
});
