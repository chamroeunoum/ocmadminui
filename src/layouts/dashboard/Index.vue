<template>
  <div class="relative w-full" >
    <div class="absolute p-4 top-16 right-0 bottom-0 left-0 ">
      <router-view v-slot="{ Component , route}">
        <component :is="Component" />
      </router-view>
    </div>
    <Dock />
    <Topmenu />
  </div>
</template>

<script>
import Topmenu from '@components/menu/topmenu.vue'
import Dock from './dock.vue'
export default {
    components: { 
      Topmenu ,
      Dock
    },
    setup() {
      return {
      };
    },
    name: "DashboardPage", 
    data() {
        return {};
    },
    computed: {},
    mounted() {
    },
    methods: {},
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