<template >
    <Transition name="slide-fade" >
        <div >
        </div>
    </Transition>
</template>
<script >

import { useDialog, useMessage, useNotification } from 'naive-ui'
import { ref , reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { authLogout, isAdmin , isSuper } from '@plugins/Authentication'


export default {
    name: 'Dashboard',
    components: {
    },
    name: 'dashboard' ,
    setup() {
        const router = useRouter()
        const store = useStore()
        const dialog = useDialog()
        const message = useMessage()
        const notify = useNotification()

        function isBackendManagement(){
            return isAdmin() || isSuper()
        }

        /**
         * Initial
         */

        return {
            isBackendManagement
        }
    }
}
</script>
<style scoped>
    .widget-thumbnail-tln {
        @reference bg-white hover:bg-yellow-50  hover:border-yellow-400 hover:shadow m-4 p-8 border rounded duration-500 cursor-pointer ;
    }
</style>