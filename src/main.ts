
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from '@/App.vue';
import router from '@/router';
import VueApexCharts from 'vue3-apexcharts';
import Toast from "vue-toastification";
import './style.css'
import "quill/dist/quill.snow.css";
import "vue-toastification/dist/index.css";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(VueApexCharts);
app.use(pinia);
app.use(Toast);
pinia.use(piniaPluginPersistedState);

app.mount('#app');
