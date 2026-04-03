<template>
  <div class="flex flex-wrap content-center z-50 mx-auto" >
    <!-- Start transaction of the apps -->
    <Transition  name="fade" >
        <!-- Apps -->
        <div v-if="toggleApps || show" class="fixed top-0 bottom-0 left-0 right-0 z-40 flex flex-wrap content-start w-full px-4 py-16 bg-gray-700 sm:px-4 md:px-4 lg:p-24 xl:p-24 bg-opacity-95 ">
            <!-- Search -->
            <div class='absolute top-0 left-0 right-0 flex flex-wrap content-center w-2/5 py-4 m-auto md:w-2/5 xl:w-1/5 lg:w-1/5 ' >
                <n-input 
                  suffix="ios-search" 
                  placeholder="ស្វែងរក ..." 
                  clearable 
                  v-model:value="search" 
                  @keyup="filterApps()"  
                >
                  <template #prefix>
                    <n-icon>
                      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M443.5,420.2L336.7,312.4c20.9-26.2,33.5-59.4,33.5-95.5c0-84.5-68.5-153-153.1-153S64,132.5,64,217s68.5,153,153.1,153 c36.6,0,70.1-12.8,96.5-34.2l106.1,107.1c3.2,3.4,7.6,5.1,11.9,5.1c4.1,0,8.2-1.5,11.3-4.5C449.5,437.2,449.7,426.8,443.5,420.2z M217.1,337.1c-32.1,0-62.3-12.5-85-35.2c-22.7-22.7-35.2-52.9-35.2-84.9c0-32.1,12.5-62.3,35.2-84.9c22.7-22.7,52.9-35.2,85-35.2 c32.1,0,62.3,12.5,85,35.2c22.7,22.7,35.2,52.9,35.2,84.9c0,32.1-12.5,62.3-35.2,84.9C279.4,324.6,249.2,337.1,217.1,337.1z"></path></svg>
                    </n-icon>
                  </template>
                </n-input>
            </div>
            <!-- End search -->
            <!-- Apps -->
            <div class="flex flex-wrap justify-center w-full apps ">
                <div v-for="(app, index) in matchedApps" :key="index" @click="toggleAppFunc(app.url);$router.push(app.url)" class="bg-gray-100 py-4 px-8 hover:scale-110 transform-gpu duration-300 text-center p-2 m-4  cursor-pointer hover:bg-gray-50 hover:bg-opacity-10 rounded-lg">
                    <div class='w-full dashboard-widget-link' >
                      <div class="text-gray-100 w-16 mx-auto my-2 " v-html="app.svg" ></div>
                      <div class="font-pvh p-2 m-auto text-xs text-center text-gray-100" v-html="app.name" ></div>
                    </div>
                </div>
                <div class="bg-gray-100 py-4 px-8 duration-300 transform hover:scale-110 text-center p-2 m-4  cursor-pointer hover:bg-gray-50 hover:bg-opacity-10 rounded-lg">
                    <div @click="logout()" class='w-full dashboard-widget-link' >
                      <div class="text-gray-100 w-16 mx-auto my-2 " >
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M10.5 2.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0v-6zM13.743 4a.5.5 0 1 0-.499.867a6.5 6.5 0 1 1-6.494.004a.5.5 0 1 0-.5-.866A7.5 7.5 0 1 0 13.743 4z" fill="currentColor"></path></g></svg>
                      </div>
                      <div class="font-pvh p-2 m-auto text-xs text-center text-gray-100" >ចាកចេញ</div>
                    </div>
                </div>
            </div>
            <!-- End apps -->            
        </div>
    </Transition>
    <!-- End transaction of the apps -->
    <!-- Apps launcher -->
    <div class='fixed -bottom-12 left-0 right-0 z-50 bg-red-500' >      
      <svg 
        v-if="!toggleLauncher" 
        @click="toggleAppFunc()" 
        class="w-10 h-10 p-2 -mt-24 mx-auto text-center bg-white rounded-full shadow-md border border-gray-300 cursor-pointer duration-300 transform hover:scale-110"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M24 9.4L22.6 8L16 14.6L9.4 8L8 9.4l6.6 6.6L8 22.6L9.4 24l6.6-6.6l6.6 6.6l1.4-1.4l-6.6-6.6L24 9.4z" fill="currentColor"></path></svg>

      <svg 
        v-if="toggleLauncher" 
        @click="toggleAppFunc()" 
        class="w-10 h-10 p-2 -mt-24 mx-auto text-center bg-white rounded-full shadow-md border border-gray-300 cursor-pointer duration-300 transform hover:scale-110"
        xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M6 15c-.83 0-1.58.34-2.12.88C2.7 17.06 2 22 2 22s4.94-.7 6.12-1.88A2.996 2.996 0 0 0 6 15zm.71 3.71c-.28.28-2.17.76-2.17.76s.47-1.88.76-2.17c.17-.19.42-.3.7-.3a1.003 1.003 0 0 1 .71 1.71zm10.71-5.06c6.36-6.36 4.24-11.31 4.24-11.31S16.71.22 10.35 6.58l-2.49-.5a2.03 2.03 0 0 0-1.81.55L2 10.69l5 2.14L11.17 17l2.14 5l4.05-4.05c.47-.47.68-1.15.55-1.81l-.49-2.49zM7.41 10.83l-1.91-.82l1.97-1.97l1.44.29c-.57.83-1.08 1.7-1.5 2.5zm6.58 7.67l-.82-1.91c.8-.42 1.67-.93 2.49-1.5l.29 1.44l-1.96 1.97zM16 12.24c-1.32 1.32-3.38 2.4-4.04 2.73l-2.93-2.93c.32-.65 1.4-2.71 2.73-4.04c4.68-4.68 8.23-3.99 8.23-3.99s.69 3.55-3.99 8.23zM15 11c1.1 0 2-.9 2-2s-.9-2-2-2s-2 .9-2 2s.9 2 2 2z" fill="currentColor"></path></svg>
      
    </div>
  </div>
</template>

<script>
import { reactive, ref , computed, onMounted } from 'vue'
import { isAuth, authLogout , isAdmin , getUser } from '../../plugins/Authentication'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { useDialog , useMessage } from 'naive-ui'
export default {  
  components: {
  } ,
  name: 'dock' ,
  props: {
    show : false ,
    showLuncher: false ,
    close: {
      type: Function
    } ,
  },
  setup(props){
    
    const search = ref(null)
    const apps = ref([
      {
          url: '/dashboard' ,
          icon: 'SpeedometerOutline' ,
          svg: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M326.1 231.9l-47.5 75.5a31 31 0 0 1-7 7a30.11 30.11 0 0 1-35-49l75.5-47.5a10.23 10.23 0 0 1 11.7 0a10.06 10.06 0 0 1 2.3 14z" fill="currentColor"></path><path d="M256 64C132.3 64 32 164.2 32 287.9a223.18 223.18 0 0 0 56.3 148.5c1.1 1.2 2.1 2.4 3.2 3.5a25.19 25.19 0 0 0 37.1-.1a173.13 173.13 0 0 1 254.8 0a25.19 25.19 0 0 0 37.1.1l3.2-3.5A223.18 223.18 0 0 0 480 287.9C480 164.2 379.7 64 256 64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M256 128v32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M416 288h-32"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M128 288H96"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M165.49 197.49l-22.63-22.63"></path><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M346.51 197.49l22.63-22.63"></path></svg>' ,
          name: 'សង្ខេបព័ត៌មាន',
          roles: [
            1, // Super
            2, // Administrator
            3, // backend
          ]
      }
    ])
    /** End app metadata */
    const toggleApps = ref(false)
    const toggleLauncher = ref( props.showLuncher )
    const user = reactive({})

    let matchedApps = ref([])
    function filterApps(){
      matchedApps.value = []
      /**
       * Filter the apps base on the search string
       */
      matchedApps.value = ( search.value != null && search.value.trim() != '' ) 
      ? apps.value.filter( app => app.name.indexOf( search.value ) != -1 )
      : apps.value
      /**
       * Filter the apps base on the user role
       */
      let userRoleIds = ( getUser() != null && getUser().roles != undefined && Array.isArray( getUser().roles ) ) ? getUser().roles.map(r=>r.id) : false
      
      /**
       * Error getting user role
       */
      matchedApps.value = matchedApps.value.filter( 
        app => app.roles.find( 
          role => userRoleIds.includes(role)
        ) 
      )
    }
    
    function toggleAppFunc(url) {
      toggleApps.value = !toggleApps.value
      toggleLauncher.value = !toggleLauncher.value
      props.close != undefined ? props.close() : false 
    }
    function logoutConfirmation(){
        console.log( "confirm before logout" )
    }

    const dialog = useDialog();
    const message = useMessage();
    const store = useStore();
    const router = useRouter()
    const route = useRoute()

    async function logout(){
      const d = dialog.warning({
        title: 'ចាកចេញ',
        content: 'តើអ្នកចង់ចាកចេញមែនទេ?',
        positiveText: 'បាទ / ចាស',
        negativeText: 'ទេ',
        onPositiveClick: () => {
          /**
           * Check whether the user has logged out already
           */
          if( isAuth() ) {
            /**
             * Show confirm dialog
             */
            d.loading = true
            store.dispatch('auth/logout').then( res => {
              message.success("អ្នកបានចាកចេញដោយជោគជ័យ។")
              d.loading = false
            }).catch( err => {
              console.log( err )
            })
            authLogout()
            window.location.href = '/'
          }else{
            window.location.href = '/login'
          }
        },
        // onNegativeClick: () => {
        //   message.error('Not Sure')
        // }
      })
    }
    function isAdminAccount(){
      return isAdmin()
    }

    filterApps()

    return {
      logout ,
      search ,
      matchedApps ,
      apps ,
      toggleApps ,
      user ,
      filterApps ,
      toggleAppFunc,
      toggleLauncher ,
      logoutConfirmation ,
      isAdminAccount 
    }
  }
}
</script>
<style scoped>
/* we will explain what these classes do next! */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>