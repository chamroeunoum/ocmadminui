<template>
  <div class="node-wrapper" :style="{ '--level': level }">
    <div class="org-row">
      <button
        type="button"
        class="toggle-button"
        :disabled="!hasChildren"
        @click="toggleNode"
      >
        <HugeiconsIcon
          v-if="hasChildren && !isOpen"
          :icon="ArrowRight01Icon"
          class="tiny-icon"
          :size="14"
        />
        <HugeiconsIcon
          v-else-if="hasChildren && isOpen"
          :icon="ArrowDown01Icon"
          class="tiny-icon"
          :size="14"
        />
        <HugeiconsIcon
          v-else
          :icon="MinusSignIcon"
          class="tiny-icon tiny-icon--muted"
          :size="14"
        />
      </button>

      <button
        type="button"
        class="org-title"
        :class="{ 'org-title--active': node.id === selectedOrgId }"
        @click="$emit('select-organization', node)"
      >
        <span class="node-icon">
          <HugeiconsIcon :icon="Building02Icon" :size="16" />
        </span>
        <span class="org-name font-sr">{{ node.name }}</span>
      </button>
    </div>

    <div v-if="hasChildren && isOpen" class="children-list">
      <OrganizationOnlyNode
        v-for="child in node.children"
        :key="child.id"
        :level="level + 1"
        :node="child"
        :selected-org-id="selectedOrgId"
        @select-organization="$emit('select-organization', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Building02Icon,
  MinusSignIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref, watch } from 'vue'

defineOptions({
  name: 'OrganizationOnlyNode'
})

const props = defineProps({
  node: {
    type: Object,
    required: true
  },
  level: {
    type: Number,
    default: 0
  },
  selectedOrgId: {
    type: Number,
    default: null
  }
})

defineEmits(['select-organization'])

const isOpen = ref(props.node.expanded ?? props.level === 0)
const hasChildren = computed(() => (props.node.children || []).length > 0)

function containsSelectedOrg(item, selectedId) {
  if (!selectedId) {
    return false
  }

  if (item.id === selectedId) {
    return true
  }

  return (item.children || []).some((child) => containsSelectedOrg(child, selectedId))
}

function toggleNode() {
  if (!hasChildren.value) {
    return
  }

  isOpen.value = !isOpen.value
}

watch(
  () => props.selectedOrgId,
  () => {
    if (containsSelectedOrg(props.node, props.selectedOrgId)) {
      isOpen.value = true
    }
  }
)
</script>

<style scoped>
.node-wrapper,
.node-wrapper * {
  text-align: left;
  user-select: text;
}

.node-wrapper {
  margin-left: calc(var(--level) * 12px);
}

.org-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.toggle-button {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5f77a2;
  background: transparent;
  border: none;
  flex-shrink: 0;
  cursor: pointer;
  padding: 0;
}

.toggle-button:disabled {
  cursor: default;
  color: #a0aabc;
}

.tiny-icon--muted {
  color: #a0aabc;
}

.org-title {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  color: #173156;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.org-title--active {
  background: #e3f2fd;
}

.node-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  background: linear-gradient(180deg, #eef5ff 0%, #dce9ff 100%);
  border: 1px solid #c9dbff;
  border-radius: 6px;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.14);
}

.org-name {
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.children-list {
  margin-top: 4px;
  margin-left: 5px;
  padding-left: 10px;
  border-left: 1px solid #dce5f2;
  display: grid;
  gap: 6px;
}
</style>
