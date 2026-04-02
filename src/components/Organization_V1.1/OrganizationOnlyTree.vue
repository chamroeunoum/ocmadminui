<template>
  <div class="organization-tree">
    <OrganizationOnlyNode
      v-for="organization in organizations"
      :key="organization.id"
      :node="organization"
      :selected-org-id="selectedOrgId"
      @select-organization="$emit('select-organization', $event)"
      @node-action="$emit('node-action', $event)"
    />
  </div>
</template>

<script setup>
import OrganizationOnlyNode from './OrganizationOnlyNode.vue'

defineProps({
  organizations: {
    type: Array,
    default: () => []
  },
  selectedOrgId: {
    type: Number,
    default: null
  }
})

defineEmits(['select-organization', 'node-action'])
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
