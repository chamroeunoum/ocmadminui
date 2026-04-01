import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import store from './store/Index.js'

import router from './Router.js'

const pinia = createPinia()
const app = createApp(App)

app.config.errorHandler = (err, vm, info) => {
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
  console.log( 'App Vue Error Handler' )
  console.log( err )
  console.log( vm )
  console.log( info )
}

window.onerror = function(message, source, lineno, colno, error) {
  // TODO: write any custom logic or logs the error
  console.log( 'Window error : ' )
  console.log( message )
  console.log( source )
  console.log( lineno )
  console.log( colno )
  console.log( error )
};


// app.config.warnHandler = function(msg, vm, trace) {
//   // `trace` is the component hierarchy trace
// }

import NaiveUI from 'naive-ui'

app.use(pinia)
app.use(store)
app.use(router)
app.use(NaiveUI)
app.mount('#app')