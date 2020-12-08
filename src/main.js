import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//按需导入vant
import '@/plugins/vant'
//引入rem布局
import 'amfe-flexible'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
