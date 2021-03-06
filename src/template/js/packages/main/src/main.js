import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

const instance = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')



// 父应用 配置代码
import {
  registerMicroApps,
  start,
  setDefaultMountApp
} from 'qiankun';
import mono from '../../../mono.config';

// 定义loader方法，loading改变时，将变量赋值给App.vue的data中的isLoading
function loader(loading) {
  if (instance && instance.$children) {
    // instance.$children[0] 是App.vue，此时直接改动App.vue的isLoading
    instance.$children[0].isLoading = loading
  }
}

if (mono) {
  const apps = [...mono.apps].map(i => ({
    ...i,
    entry: `http://${i.host}:${i.port}`,
    container: mono.container, // 子应用挂载的div
    props: {
      routerBase: i.activeRule, // 下发基础路由
      history: i.history
    },
    loader:loader
  }))
  registerMicroApps(apps, {
    beforeLoad: app => {
      console.log('before load app.name====>>>>>', app.name)
    },
    beforeMount: [
      app => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name)
      }
    ],
    afterMount: [
      app => {
        console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name)
      }
    ],
    afterUnmount: [
      app => {
        console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name)
      }
    ]
  })
  setDefaultMountApp(mono.defaultApp)
  start()
}