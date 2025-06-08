import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// 引入 Arco Design 组件库和样式
import ArcoVue from '@arco-design/web-vue'
import '@arco-design/web-vue/dist/arco.css'

// 引入 Element Plus 组件库和样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVue) 
app.use(ElementPlus)

app.mount('#app')
