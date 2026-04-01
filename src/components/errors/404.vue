<template >
  <div class="flex justify-center ">
      <Transition name="slide-fade" >
          <div v-if="slideFadeHelper" class="w-full mx-4 xs:w-full sm:w-4/5 md:w-2/4 lg:w-2/5 xl:w-2/5 p-8 md:mt-24 sm:mt-12 mb-24">
              <div class="w-20 mx-auto my-4">
                  <img src="./../../assets/logo.svg" class="w-full" >
              </div>
              <div class="text-center my-2" >
                  <!-- <div class="my-2 text-xs font-moul">{{ store.state.organization.name }}</div> -->
                  <div class="my-2 text-xs font-moul text-yellow-500">ទីស្ដីការគណៈរដ្ឋមន្ត្រី</div>
                  <div class="my-2 text-4xl font-tacteing" >3</div>
              </div>
              <div class="w-full mx-auto my-2 text-xs font-moul">{{ store.state.system.name }}</div>
              <div class="w-full mx-auto mt-20 mb-8 pb-2 text-center text-lg flex justify-center ">
                <svg class="w-20 " xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496 512"><path d="M248 504C111 504 0 393 0 256S111 8 248 8c20.9 0 41.3 2.6 60.7 7.5L42.3 392H248v112zm0-143.6V146.8L98.6 360.4H248zm96 31.6v92.7c45.7-19.2 84.5-51.7 111.4-92.7H344zm57.4-138.2l-21.2 8.4l21.2 8.3v-16.7zm-20.3 54.5c-6.7 0-8 6.3-8 12.9v7.7h16.2v-10c0-5.9-2.3-10.6-8.2-10.6zM496 256c0 37.3-8.2 72.7-23 104.4H344V27.3C433.3 64.8 496 153.1 496 256zM360.4 143.6h68.2V96h-13.9v32.6h-13.9V99h-13.9v29.6h-12.7V96h-13.9v47.6zm68.1 185.3H402v-11c0-15.4-5.6-25.2-20.9-25.2c-15.4 0-20.7 10.6-20.7 25.9v25.3h68.2v-15zm0-103l-68.2 29.7V268l68.2 29.5v-16.6l-14.4-5.7v-26.5l14.4-5.9v-16.9zm-4.8-68.5h-35.6V184H402v-12.2h11c8.6 15.8 1.3 35.3-18.6 35.3c-22.5 0-28.3-25.3-15.5-37.7l-11.6-10.6c-16.2 17.5-12.2 63.9 27.1 63.9c34 0 44.7-35.9 29.3-65.3z" fill="currentColor"></path></svg>
                <div class="ml-12 my-8">ទំព័រដែលអ្នកស្វែងរកមិនមានឡើយ ។</div>
              </div>
          </div>
      </Transition>
      <div class="fixed bottom-0 w-full"><Footer /></div>
      <Frame4Corner />
  </div>
</template>
<script>
import Footer from '@components/footer/CopyRight.vue'
import Frame4Corner from '@components/widgets/frame/ស៊ុមក្បាច់.vue'
import { reactive, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useNotification } from 'naive-ui'
export default {
  name: "register" ,
  components: {
      Footer ,
      Frame4Corner
  },
  setup(){

      const store = useStore()
      const notify = useNotification()
      const router = useRouter()
      
      const slideFadeHelper = ref(false)
      
      const systemName = computed( () => {
          return store.state.system.name != "" ? store.state.system.name : 'ប្រព័ន្ធគ្រប់គ្រងឯកសារអេឡិចត្រូនិច' 
      })
      const companyName = computed( () => {
          return store.state.organization.name != "" ? store.state.organization.name : 'ឈ្មោះក្រុមហ៊ុន' 
      })

      setTimeout( function(){
          slideFadeHelper.value = true
      }, 300 )

      return {
          companyName ,
          systemName ,
          store ,
          slideFadeHelper
      }
  }
}
</script>
<style >
  
  #app {
      position: absolute;
      width: 100%;
      height: 100%;
  }
  .layout {
      height: 100%;
      width: 100%;
  }
  .ivu-layout {
      height: 100%;
  }
  .ivu-layout-footer {
      background: #f5f7f9;
      padding: 12px 50px;
      color: #515a6e;
      font-size: 14px;
      position: absolute;
      bottom: 0px;
      width: 100%;
  }
  .ivu-form-item {
      margin: auto auto 10px auto;
  }
  .ivu-form-item-error-tip {
      position: relative;
  }
</style>