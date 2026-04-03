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

      <div class="org-title" :class="{ 'org-title--active': node.id === selectedOrgId }">
        <button
          type="button"
          class="org-title-button"
          @click="$emit('select-organization', node)"
        >
          <span class="node-icon">
            <HugeiconsIcon :icon="Building02Icon" :size="16" />
          </span>
          <span class="org-name font-sr">{{ node.name }}</span>
        </button>

        <div class="node-menu-wrap">
          <button
            type="button"
            class="node-menu-trigger"
            @click.stop="toggleMenu"
          >
            ...
          </button>

          <div v-if="isMenuOpen" class="node-menu">
            <button type="button" class="node-menu__item font-sr" @click.stop="emitNodeAction('add-position')">
              <span class="node-menu__icon">
                <HugeiconsIcon :icon="UserCircleIcon" :size="15" />
              </span>
              <span>បន្ថែមតួនាទី</span>
            </button>
            <button type="button" class="node-menu__item font-sr" @click.stop="emitNodeAction('add-organization')">
              <span class="node-menu__icon">
                <HugeiconsIcon :icon="Building02Icon" :size="15" />
              </span>
              <span>បន្ថែមអង្គភាព</span>
            </button>
            <button type="button" class="node-menu__item node-menu__item--danger font-sr" @click.stop="emitNodeAction('delete')">
              <span class="node-menu__icon">
                <HugeiconsIcon :icon="MinusSignIcon" :size="15" />
              </span>
              <span>លុប</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasChildren && isOpen" class="children-list">
      <OrganizationOnlyNode
        v-for="child in node.children"
        :key="child.id"
        :level="level + 1"
        :node="child"
        :selected-org-id="selectedOrgId"
        @select-organization="$emit('select-organization', $event)"
        @node-action="$emit('node-action', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import {
  ArrowDown01Icon,
  ArrowRight01Icon,
  Building02Icon,
  MinusSignIcon,
  UserCircleIcon
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

const emit = defineEmits(['select-organization', 'node-action'])

const isOpen = ref(props.node.expanded ?? props.level === 0)
const isMenuOpen = ref(false)
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

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function emitNodeAction(action) {
  isMenuOpen.value = false
  emit('node-action', {
    action,
    node: props.node
  })
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
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  padding: 6px 8px;
  color: #173156;
  background: transparent;
  border: none;
  border-radius: 10px;
}

.org-title-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  color: inherit;
  background: transparent;
  border: none;
  padding: 0;
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
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-menu-wrap {
  position: relative;
  margin-left: 8px;
}

.node-menu-trigger {
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #6b7d95;
  font-size: 16px;
  line-height: 1;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background-color 0.2s ease;
}

.org-title:hover .node-menu-trigger,
.node-menu-wrap:hover .node-menu-trigger,
.node-menu-wrap:focus-within .node-menu-trigger,
.node-menu-trigger:focus-visible,
.node-menu-trigger:active {
  opacity: 1;
}

.node-menu-trigger:hover {
  background: #eef3f9;
}

.node-menu {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 148px;
  padding: 6px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 12px;
  box-shadow: 0 14px 28px rgba(20, 36, 66, 0.12);
  z-index: 30;
}

.node-menu__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  color: #334861;
  font-size: 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
}

.node-menu__icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #5f77a2;
  flex-shrink: 0;
}

.node-menu__item:hover {
  background: #f3f7fc;
}

.node-menu__item--danger {
  color: #c0392b;
}

.node-menu__item--danger .node-menu__icon {
  color: #c0392b;
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
