import { createApp } from 'vue';

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

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
  // components,
  // directives,
});

const pinia = createPinia();

createApp(App).use(pinia).use(vuetify).mount('#app');
