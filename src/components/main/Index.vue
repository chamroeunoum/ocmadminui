<template>
  <div class="relative bg-background bg-gray-50 bg-cover bg-center w-full min-h-screen" >
    <div class="top-10 right-0 bottom-0 left-0 absolute p-4">
      <router-view v-slot="{ Component , route}">
        <Transition name="fade" mode="out-in" >
          <component :is="Component" />
        </Transition>
      </router-view>
    </div>
    <Topmenu />
  </div>
</template>

<script>
import Topmenu from '../menu/TopMenu.vue'
export default {
    components: { 
      Topmenu 
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