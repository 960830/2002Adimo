import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false;

// 配置axios信息
import axios from "axios"
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
axios.interceptors.request.use(config=>{
  config.headers.Authorization = window.sessionStorage.getItem("token")
  return config
})
Vue.prototype.$axios = axios;

// 引入element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path == '/login') return next()
  const token = window.sessionStorage.getItem("token")
    if(to.path == '/login'){
      if(token !== null){
        next('/home')
      }
    }else{
      if(token == null){
          return next('/login')
      }
    }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
