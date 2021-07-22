import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// 引入全局的样式文件
import './assets/css/global.less'

// 请求基准路径的配置
// axios.defaults.baseURL = 'http://localhost:8888/api/'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/'

// 将axios挂载到Vue的原型对象上
// 在别的组件中this.$http  http是自己取得名字
Vue.prototype.$http = axios

// 1.将全局的echarts对象挂载到Vue的原型对象上
// 别的组件中 this.$echarts
Vue.prototype.$echarts = window.echarts

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
