<template>
  <n-loading-bar-provider >
    <n-dialog-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider placement="bottom-right" >
          <router-view v-slot="{ Component, route }">
            <component :is="Component" />
          </router-view>
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>
<script>
export default {
  setup() { }
}
</script>
<style scoped>
</style>
