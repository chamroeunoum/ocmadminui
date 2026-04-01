<template>
  <div class="flex justify-center min-h-screen "  >
    <div class="w-full ">
      <login-page />
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
import LoginPage from '@components/login/LoginPage.vue'
export default {
  name: 'LoginTemplate' ,
  components: {
    FooterComponent ,
    Frame4Corner,
    LoginPage
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
