<template>
  <div class="flex" >
    <div class="w-60 bg-gray-100 border border-gray-300 min-h-screen" >
        <!-- Organizations -->
         <div class="" ></div>
    </div>
    <div class="grow" >Content</div>
  </div>
</template>
<script>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useDialog, useMessage, useNotification } from 'naive-ui'

export default {
  name: "RoleContentPage" ,
  components: {
  },
  setup(){
    var store = useStore()
    const dialog = useDialog()
    const message = useMessage()
    const notify = useNotification()

    /**
     * Initial the data
     */

    return {
      
    }
  }
}

</script>