<template>
  <section class="info-panel">
    <div class="section-header">
      <div class="section-title-row">
        <HugeiconsIcon :icon="Shield01Icon" class="section-icon" :size="22" />
        <div>
          <h3 class="card-title">Roles in {{ systemName }}</h3>
          <p class="section-note">Select one or more roles for the current holder.</p>
        </div>
      </div>

      <span class="assigned-badge">Assigned: {{ assignedCount }}</span>
    </div>

    <div class="role-grid">
      <button
        v-for="role in roles"
        :key="role.id"
        type="button"
        class="role-card"
        :class="{ selected: assignedRoleIds.includes(role.id) }"
        @click="$emit('toggle-role', role.id)"
      >
        <div class="role-copy">
          <span v-if="assignedRoleIds.includes(role.id)" class="role-tag role-tag--active">Assigned</span>
          <h4>{{ role.name }}</h4>
          <p>{{ role.description }}</p>
        </div>

        <span class="role-action">
          <HugeiconsIcon
            :icon="assignedRoleIds.includes(role.id) ? CheckmarkCircle02Icon : CircleIcon"
            class="role-status-icon"
            :size="18"
          />
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { CheckmarkCircle02Icon, CircleIcon, Shield01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed } from 'vue'

const props = defineProps({
  systemName: {
    type: String,
    default: ''
  },
  roles: {
    type: Array,
    default: () => []
  },
  assignedRoleIds: {
    type: Array,
    default: () => []
  }
})

defineEmits(['toggle-role'])

const assignedCount = computed(() => props.assignedRoleIds.length)
</script>

<style scoped>
.info-panel,
.info-panel * {
  text-align: left;
  user-select: text;
}

.info-panel {
  padding: 18px 18px 20px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(21, 39, 71, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 22px;
  height: 22px;
  color: #3d5afe;
  stroke-width: 1.9;
}

.card-title {
  margin: 0 0 4px;
  color: #0f274a;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.section-note {
  margin: 0;
  color: #7a8ca4;
  font-size: 12px;
}

.assigned-badge {
  padding: 6px 10px;
  color: #3d5afe;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: #e9f0ff;
  border-radius: 999px;
}

.role-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.role-card {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  align-items: flex-start;
  min-height: 86px;
  padding: 18px 16px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.role-card.selected {
  border-color: #7ea7ff;
  box-shadow: 0 0 0 2px rgba(84, 133, 255, 0.1);
}

.role-copy {
  flex: 1;
}

.role-tag {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  margin-bottom: 8px;
  color: #3d5afe;
  font-size: 11px;
  font-weight: 700;
  background: #eef3ff;
  border-radius: 999px;
  text-transform: uppercase;
}

.role-tag--active {
  background: #e9f0ff;
}

.role-card h4 {
  margin: 0 0 6px;
  color: #193355;
  font-size: 15px;
  font-weight: 700;
}

.role-card p {
  margin: 0;
  color: #64758a;
  font-size: 14px;
  line-height: 1.6;
}

.role-status-icon {
  width: 18px;
  height: 18px;
  color: #3d5afe;
  stroke-width: 1.8;
  flex-shrink: 0;
}

.role-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #f4f7fc;
  border-radius: 10px;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .role-grid {
    grid-template-columns: 1fr;
  }
}
</style>
