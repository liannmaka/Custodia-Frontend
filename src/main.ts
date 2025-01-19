
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue';
import './style.css'
import "quill/dist/quill.core.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
pinia.use(piniaPluginPersistedState);

app.mount('#app');
