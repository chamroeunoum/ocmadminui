<template>
  <div class="relative bg-gray-50 w-full min-h-screen" >
    <div class="top-0 right-0 bottom-0 left-0 absolute">
      <router-view v-slot="{ Component , route}">
        <Transition name="slide-fade" >
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
    <dock-horizontal v-bind:showLuncher="true" v-bind:show="false" />
  </div>
</template>
<script >
import DockHorizontal from '@components/widgets/DockHorizontal.vue'
export default {
    name: "RoleManagementPage" ,
    components: { 
      DockHorizontal
    },
    setup() {
      return {}
    }    
}
</script>
<style scoped>
/* we will explain what these classes do next! */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
