<template>
  <div class="organization-tree">
    <OrganizationNode
      v-for="organization in organizations"
      :key="organization.id"
      :node="organization"
      :selected-position-id="selectedPositionId"
      @select-position="$emit('select-position', $event)"
    />
  </div>
</template>

<script setup>
import OrganizationNode from './OrganizationNode.vue'

defineProps({
  organizations: {
    type: Array,
    default: () => []
  },
  selectedPositionId: {
    type: Number,
    default: null
  }
})

defineEmits(['select-position'])
</script>

<style scoped>
.organization-tree,
.organization-tree * {
  text-align: left;
  user-select: text;
}

.organization-tree {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
