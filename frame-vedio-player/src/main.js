// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
// import glsl from 'vite-plugin-glsl'
import 'normalize.css'
import * as THREE from 'three'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')