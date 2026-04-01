<template>
  <div class="flex justify-center min-h-screen "  >
    <div class="w-full mx-8 sm:w-1/2 md:w-96 lg:w-96 xl:96 p-8 ">
      <div class="w-20 mx-auto mt-6">
        <img :src="ocmLogoUrl" class="w-full" >
      </div>
      <div class="text-center" >
        <div class="my-2 font-moul text-yellow-500">ទីស្ដីការគណៈរដ្ឋមន្ត្រី</div>
        <div class="my-2 text-4xl font-tacteing" >3</div>
        <div class="my-2 font-moul hidden">{{ store.state.company.name }}</div>
        <div class="my-2 font-moul hidden">នាយកដ្ឋានឯកសារអេឡិចត្រូនិចនិងព័ត៌មានវិទ្យា</div>
      </div>
      <div class="w-full mx-auto my-2 leading-6 text-center font-moul ">{{ store.state.system.name }}</div>
      <!-- <div class="w-full mx-auto my-2 text-xs font-moul">{{ store.state.system.name }}</div> -->
      <div class="w-full mx-auto mt-8 mb-4 text-left text-md">ចូលប្រព័ន្ធ</div>
      <n-form >
        <n-space vertical>
          <n-input round 
            placeholder="អ៊ីមែល"
            v-model:value="credentials.email"
            clearable
            @keyup.enter="funcLogin"
          >
            <template #prefix>
              <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 1.95c-5.52 0-10 4.48-10 10s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8s8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57v-1.43c0-2.76-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47c.65.89 1.77 1.47 2.96 1.47c1.97 0 3.5-1.6 3.5-3.57v-1.43c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z" fill="currentColor"></path></svg>
            </template>
          </n-input>
          <n-input round 
            placeholder="ពាក្យសំងាត់"
            v-model:value="credentials.password"
            type="password"
            clearable
            @keyup.enter="funcLogin"
          >
            <template #prefix>
              <svg class="w-4 h-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M15 6a1 1 0 1 1-2 0a1 1 0 0 1 2 0zm-2.5-4C9.424 2 7 4.424 7 7.5c0 .397.04.796.122 1.175c.058.27-.008.504-.142.638l-4.54 4.54A1.5 1.5 0 0 0 2 14.915V16.5A1.5 1.5 0 0 0 3.5 18h2A1.5 1.5 0 0 0 7 16.5V16h1a1 1 0 0 0 1-1v-1h1a1 1 0 0 0 1-1v-.18c.493.134 1.007.18 1.5.18c3.076 0 5.5-2.424 5.5-5.5S15.576 2 12.5 2zM8 7.5C8 4.976 9.976 3 12.5 3S17 4.976 17 7.5S15.024 12 12.5 12c-.66 0-1.273-.095-1.776-.347A.5.5 0 0 0 10 12.1v.9H9a1 1 0 0 0-1 1v1H7a1 1 0 0 0-1 1v.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.586a.5.5 0 0 1 .146-.353l4.541-4.541c.432-.432.522-1.044.412-1.556A4.619 4.619 0 0 1 8 7.5z" fill="currentColor"></path></g></svg>
            </template>
          </n-input>
        </n-space>
        <div class="w-full mt-12">
          <n-button :loading="loading" @click="funcLogin" type="success" class="w-48"  >
            ចូល
            <template #icon>
              <svg class="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1024 1024"><defs></defs><path d="M521.7 82c-152.5-.4-286.7 78.5-363.4 197.7c-3.4 5.3.4 12.3 6.7 12.3h70.3c4.8 0 9.3-2.1 12.3-5.8c7-8.5 14.5-16.7 22.4-24.5c32.6-32.5 70.5-58.1 112.7-75.9c43.6-18.4 90-27.8 137.9-27.8c47.9 0 94.3 9.3 137.9 27.8c42.2 17.8 80.1 43.4 112.7 75.9c32.6 32.5 58.1 70.4 76 112.5C865.7 417.8 875 464.1 875 512c0 47.9-9.4 94.2-27.8 137.8c-17.8 42.1-43.4 80-76 112.5s-70.5 58.1-112.7 75.9A352.8 352.8 0 0 1 520.6 866c-47.9 0-94.3-9.4-137.9-27.8A353.84 353.84 0 0 1 270 762.3c-7.9-7.9-15.3-16.1-22.4-24.5c-3-3.7-7.6-5.8-12.3-5.8H165c-6.3 0-10.2 7-6.7 12.3C234.9 863.2 368.5 942 520.6 942c236.2 0 428-190.1 430.4-425.6C953.4 277.1 761.3 82.6 521.7 82zM395.02 624v-76h-314c-4.4 0-8-3.6-8-8v-56c0-4.4 3.6-8 8-8h314v-76c0-6.7 7.8-10.5 13-6.3l141.9 112a8 8 0 0 1 0 12.6l-141.9 112c-5.2 4.1-13 .4-13-6.3z" fill="currentColor"></path></svg>
            </template>
          </n-button>
        </div>
      </n-form>
      <div class="fixed bottom-0 left-0 right-0">
        <FooterComponent />
      </div>
    </div>
    <Frame4Corner />
  </div>
</template>
<script>
import FooterComponent from '@components/footer/CopyRight.vue'
import Frame4Corner from '../../components/widgets/frame/ស៊ុមក្បាច់.vue'
import { setMaxUploadFilesize } from '@plugins/File'
import { getRoutes } from '@plugins/Route'
import { getUser } from '@plugins/Authentication'
import { ref, reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useNotification, useMessage } from 'naive-ui'
import ocmLogoUrl from '@assets/logo.svg'

export default {
  name: 'LoginTemplate' ,
  components: {
    FooterComponent ,
    Frame4Corner
  },
  setup(){
    /**
     * Components to use
     */
    const store = useStore()
    const message = useMessage()
    const router = useRouter()
    const notification = useNotification()

    if( getUser() !== undefined && getUser() !== null ){
      router.push('/dashboard')  
    }

    /**
     * Data
     */
    const credentials = reactive({
        email: '' ,
        password: '' ,
      })
    const loading = ref( false )
    /**
     * Login function
     */
    function funcLogin(){
      if( credentials.email == "" || credentials.email == null ){
        notification.warning({
          title: "ព័ត៌មានមិនគ្រប់គ្រាន់" ,
          duration: 1000 ,
          content: "សូមបញ្ចូលអ៊ីមែលរបស់អ្នក រួចព្យាយាមម្ដងទៀត បាទ។"
        })
        return false
      }
      if( credentials.password == "" || credentials.password == null ){
        notification.warning({
          title: "ព័ត៌មានមិនគ្រប់គ្រាន់" ,
          duration: 1000 ,
          content: "សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក រួចព្យាយាមម្ដងទៀត បាទ។"
        })
        return false
      }
      loading.value = true
      store.dispatch('auth/login',{
        email: credentials.email.toLowerCase() ,
        password: credentials.password
      }).then( res => {
        if( res.data.ok ){
          /**
           * Store the authenticated user into the store
           */
          store.commit('auth/setAuthentication',{
            user: res.data.record ,
            token: res.data.token ,
          })
          
          setMaxUploadFilesize( parseFloat( res.data.upload_max_filesize.replace( 'M' , '' ) ) )

          let routes = router.getRoutes()
          for(let i in routes ){
            router.hasRoute( routes[i].name ) ? router.removeRoute( routes[i].name ) : false
          }
          routes = getRoutes()
          for(let i in routes ){
            router.addRoute( routes[i] )
          }

          message.success("សូមស្វាគមន៍ !")
          
          console.log( res.data )
          router.push('/dashboard')
          // window.location.reload()
        }else{
          notification.warning({
            title: "ចូលប្រព័ន្ធ " ,
            content: res.data.message ,
            duration: 1000,
            closable: false
          })
        }
        loading.value = false
      }).catch( err => {
        console.log( err )
        loading.value = false
        if( err.response !== null ){
          let message = err.response.status + ": " + err.response.statusText + "."
          if( err.response.data !== null ){
            for(var key in err.response.data.errors ){
              message += err.response.data.errors[key]
            }  
          }
          notification.error({
            title: "ចូលប្រើប្រាស់" ,
            meta: message ,
            duration: 3000 ,
            content: err.response.data.message
          })
        }else{
          console.log( err.response )
        }
      });
    }
    /**
     * End login function
     */
    return {
      /**
       * data
       */
      credentials ,
      loading, 
      /**
       * Functions
       */
      funcLogin ,
      /**
       * Components
       */
      store ,
      ocmLogoUrl
    }
  },
  mounted(){
  
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 0.8rem;
}
</style>
