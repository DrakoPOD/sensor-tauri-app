import { createApp } from 'vue';
import { load } from '@tauri-apps/plugin-store';
import { mkdir, exists, BaseDirectory } from '@tauri-apps/plugin-fs';

import 'uplot/dist/uPlot.min.css';

// Vuetify
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { createVuetify } from 'vuetify';

// import { aliases, mdi } from 'vuetify/iconsets/mdi';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';

// Pinia
import { createPinia } from 'pinia';

// Components
import App from './App.vue';

const settings = await load('settings.json');

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme:
      (await settings.get<{ value: string }>('theme'))?.value || 'light',
  },
  // components,
  // directives,
});

try {
  const existsExperiments = await exists('experiments', {
    baseDir: BaseDirectory.AppLocalData,
  });

  if (!existsExperiments) {
    await mkdir('experiments', {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  const existsImages = await exists('experiments/images', {
    baseDir: BaseDirectory.AppLocalData,
  });

  if (!existsImages) {
    await mkdir('experiments/images', {
      baseDir: BaseDirectory.AppLocalData,
    });
  }

  const existsVideos = await exists('experiments/videos', {
    baseDir: BaseDirectory.AppLocalData,
  });

  if (!existsVideos) {
    await mkdir('experiments/videos', {
      baseDir: BaseDirectory.AppLocalData,
    });
  }
} catch (error) {
  console.error(error);
}

const pinia = createPinia();

createApp(App).use(pinia).use(vuetify).mount('#app');
