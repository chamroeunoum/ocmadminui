<template>
  <div class="system-tabs">
    <button
      v-for="system in systems"
      :key="system.key"
      type="button"
      class="tab-button"
      :class="{ active: system.key === activeSystem }"
      @click="updateSystem(system.key)"
    >
      <span class="tab-icon">
        <HugeiconsIcon v-if="system.key === 'erp'" :icon="Building02Icon" class="tab-svg" :size="16" />
        <HugeiconsIcon v-else-if="system.key === 'hr'" :icon="IdentificationIcon" class="tab-svg" :size="16" />
        <HugeiconsIcon v-else :icon="UserGroupIcon" class="tab-svg" :size="16" />
      </span>
      <span class="font-moul">{{ system.name }}</span>
    </button>
  </div>
</template>

<script setup>
import { Building02Icon, IdentificationIcon, UserGroupIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'

defineProps({
  systems: {
    type: Array,
    default: () => []
  },
  activeSystem: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:activeSystem'])

function updateSystem(value) {
  emit('update:activeSystem', value)
}
</script>

<style scoped>
.system-tabs,
.system-tabs * {
  text-align: left;
  user-select: text;
}

.system-tabs {
  display: flex;
  width: fit-content;
  max-width: 100%;
  padding: 4px;
  background: #eaf0f6;
  border: 1px solid #dde5ef;
  border-radius: 16px;
  gap: 4px;
}

.tab-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: #526377;
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tab-button.active {
  color: #264fc0;
  background: #ffffff;
  border-color: #d7e0ec;
  box-shadow: 0 6px 14px rgba(31, 52, 89, 0.08);
}

.tab-icon {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.88);
  border-radius: 10px;
  flex-shrink: 0;
}

.tab-button.active .tab-icon {
  background: #eef3ff;
}

.tab-button:nth-child(1) .tab-icon {
  color: #2563eb;
  background: #e8f0ff;
}

.tab-button:nth-child(2) .tab-icon {
  color: #0f9f72;
  background: #e8faf3;
}

.tab-button:nth-child(3) .tab-icon {
  color: #f08a1f;
  background: #fff4e9;
}

.tab-svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

@media (max-width: 720px) {
  .system-tabs {
    width: 100%;
    overflow-x: auto;
  }
}
</style>
