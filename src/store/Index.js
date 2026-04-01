import { createStore, createLogger } from 'vuex'
import auth from './modules/Authentication.js'
import error from './modules/Error.js'
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state: {
    organization: {
      name: 'អគ្គនាយកដ្ឋានបដិវត្តកម្មឌីជីថល'
    },
    system: {
      name: 'អង្គភាពចំណុះទីស្ដីការគណៈរដ្ឋមន្ត្រី'
    },
    company: {
      name: 'អគ្គនាយកដ្ឋានបដិវត្តកម្មឌីជីថល'
    }
  },
  modules: {
    // product ,
    auth,
    error
  },
  strict: debug,
  plugins: debug ? 
    [
      createLogger()
    ] : 
    [
      
    ]
})
