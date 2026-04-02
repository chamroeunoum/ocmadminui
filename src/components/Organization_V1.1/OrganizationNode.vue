<template>
  <div class="node-wrapper" :style="{ '--level': level }">
    <div class="org-row">
      <button
        type="button"
        class="toggle-button"
        :disabled="!hasExpandableContent"
        @click="toggleNode"
      >
        <HugeiconsIcon
          v-if="hasExpandableContent && !isOpen"
          :icon="ArrowRight01Icon"
          class="tiny-icon"
          :size="14"
        />
        <HugeiconsIcon
          v-else-if="hasExpandableContent && isOpen"
          :icon="ArrowDown01Icon"
          class="tiny-icon"
          :size="14"
        />
        <HugeiconsIcon v-else :icon="MinusSignIcon" class="tiny-icon tiny-icon--muted" :size="14" />
      </button>

      <div class="org-content">
        <div class="org-title">
          <div class="org-title-main">
            <span class="node-icon">
              <HugeiconsIcon :icon="Building02Icon" class="node-svg" :size="16" />
            </span>
            <h3>{{ node.name }}</h3>
          </div>

          <div v-if="hasChildren" class="org-meta">
            <span class="meta-count">{{ childCount }}</span>
            <span class="meta-label font-sr">{{ childCount === 1 ? '1 អង្គភាពរង' : `${childCount} អង្គភាពរង` }}</span>
          </div>
        </div>

        <div v-if="showPositions" class="positions-section">
          <div class="positions-list">
            <button
              v-for="position in node.positions"
              :key="position.id"
              type="button"
              class="position-row item"
              :class="{ 'active-item': position.id === selectedPositionId }"
              @click="selectPosition(position)"
            >
              <span class="position-dash">-</span>
              <span class="position-icon">
                <HugeiconsIcon :icon="UserCircleIcon" class="position-svg" :size="15" />
              </span>
              <strong>{{ position.name }}</strong>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="hasChildren && isOpen" class="children-list">
      <OrganizationNode
        v-for="child in node.children"
        :key="child.id"
        :level="level + 1"
        :node="child"
        :selected-position-id="selectedPositionId"
        @select-position="$emit('select-position', $event)"
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
  name: 'OrganizationNode'
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
  selectedPositionId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['select-position'])

// Root level starts open so the page feels populated on first load.
const isOpen = ref(props.node.expanded ?? props.level === 0)

const hasChildren = computed(() => (props.node.children || []).length > 0)
const hasPositions = computed(() => (props.node.positions || []).length > 0)
const hasExpandableContent = computed(() => hasChildren.value || hasPositions.value)
const showPositions = computed(() => {
  return hasPositions.value && isOpen.value
})
const childCount = computed(() => (props.node.children || []).length)
const containsSelectedPosition = computed(() => {
  return checkSelectedBranch(props.node, props.selectedPositionId)
})
const hasSelectedPositionHere = computed(() => {
  return (props.node.positions || []).some((position) => position.id === props.selectedPositionId)
})

function checkSelectedBranch(item, selectedId) {
  if (!selectedId) {
    return false
  }

  const hasSelectedHere = (item.positions || []).some((position) => position.id === selectedId)

  if (hasSelectedHere) {
    return true
  }

  return (item.children || []).some((child) => checkSelectedBranch(child, selectedId))
}

function toggleNode() {
  if (!hasExpandableContent.value) {
    return
  }

  isOpen.value = !isOpen.value
}

function selectPosition(position) {
  emit('select-position', position)
}

watch(
  () => props.selectedPositionId,
  () => {
    if (containsSelectedPosition.value) {
      isOpen.value = true
    }

    if (hasSelectedPositionHere.value) {
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
  align-items: flex-start;
}

.org-content {
  flex: 1;
  min-width: 0;
}

.toggle-button {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  color: #12233d;
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

.tiny-icon {
  width: 14px;
  height: 14px;
  color: #5f77a2;
  stroke-width: 2;
}

.tiny-icon--muted {
  color: #a0aabc;
}

.org-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 32px;
  padding: 6px 8px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.org-title-main {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.org-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding-left: 8px;
  flex-shrink: 0;
}

.meta-count {
  color: #c4ccda;
  font-size: 11px;
  font-weight: 700;
}

.meta-label {
  color: #c4ccda;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.node-icon {
  width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #2563eb;
  background: linear-gradient(180deg, #eef5ff 0%, #dce9ff 100%);
  border: 1px solid #c9dbff;
  border-radius: 6px;
  flex-shrink: 0;
}

.node-svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

.org-title h3 {
  margin: 0;
  color: #173156;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.positions-section {
  margin-top: 4px;
}

.positions-list {
  margin-left: 18px;
  display: grid;
  gap: 4px;
}

.position-row {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 100%;
  padding: 6px 8px;
  color: #173156;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-radius 0.2s ease, color 0.2s ease;
}

.active-item {
  background-color: #E3F2FD;
  border-radius: 8px;
}

.position-dash {
  color: #c2cbda;
  font-size: 12px;
  line-height: 1;
}

.position-icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f9f72;
  background: linear-gradient(180deg, #effdf7 0%, #daf7ea 100%);
  border: 1px solid #c6efd9;
  border-radius: 999px;
}

.position-svg {
  width: 15px;
  height: 15px;
  stroke-width: 1.8;
}

.position-row strong {
  color: #173156;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.active-item .position-icon {
  color: #1565c0;
  background: linear-gradient(180deg, #e9f3ff 0%, #d5e8ff 100%);
  border-color: #b8d5ff;
}

.active-item strong {
  color: #0f3f8c;
}

.children-list {
  margin-top: 4px;
  margin-left: 5px;
  padding-left: 10px;
  border-left: 1px solid #dce5f2;
  display: grid;
  gap: 6px;
}

@media (max-width: 720px) {
  .org-title {
    align-items: flex-start;
    flex-direction: column;
  }

  .org-meta {
    justify-content: flex-start;
  }
}
</style>
