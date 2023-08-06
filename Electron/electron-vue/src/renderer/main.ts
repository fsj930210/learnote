import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router/router';
import './styles/index.css';
import './assets/icon/iconfont.css';

createApp(App).use(router).mount('#app')
