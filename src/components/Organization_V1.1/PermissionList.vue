<template>
  <section class="info-panel">
    <div class="section-header">
      <div class="section-title-row">
        <HugeiconsIcon :icon="Key01Icon" class="section-icon" :size="22" />
        <div>
          <h3 class="card-title">Granular Permissions</h3>
          <p class="section-note">Manage fine-grained access control across all modules.</p>
        </div>
      </div>

      <div class="section-tools">
        <label class="search-box">
          <HugeiconsIcon :icon="Search02Icon" class="search-icon" :size="16" />
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Filter permissions..."
          >
        </label>

        <button type="button" class="filter-button">
          <HugeiconsIcon :icon="FilterHorizontalIcon" :size="16" />
        </button>
      </div>
    </div>

    <div v-if="groupedPermissions.length" class="permission-groups">
      <section
        v-for="group in groupedPermissions"
        :key="group.name"
        class="permission-group"
      >
        <div class="permission-group__header">
          <div class="permission-group__title">
            <HugeiconsIcon :icon="ArrowDown01Icon" class="permission-group__arrow" :size="14" />
            <h4>{{ group.name }}</h4>
            <span class="permission-group__count">{{ getAssignedCount(group.items) }}/{{ group.items.length }}</span>
          </div>

          <button
            type="button"
            class="permission-group__select-all"
            @click="toggleGroup(group)"
          >
            {{ isGroupFullyAssigned(group.items) ? 'Clear All' : 'Select All' }}
          </button>
        </div>

        <table class="permission-table">
          <thead>
            <tr>
              <th>Permission</th>
              <th>Description</th>
              <th class="permission-table__status">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="permission in group.items"
              :key="permission.id"
              :class="{ selected: assignedPermissionIds.includes(permission.id) }"
            >
              <td>
                <button
                  type="button"
                  class="permission-name"
                  @click="$emit('toggle-permission', permission.id)"
                >
                  <span class="permission-check">
                    <HugeiconsIcon
                      :icon="assignedPermissionIds.includes(permission.id) ? CheckmarkSquare02Icon : SquareIcon"
                      :size="18"
                    />
                  </span>
                  <strong>{{ permission.name }}</strong>
                </button>
              </td>
              <td>{{ permission.description }}</td>
              <td class="permission-table__status">
                <span
                  class="status-pill"
                  :class="{ active: assignedPermissionIds.includes(permission.id) }"
                >
                  {{ assignedPermissionIds.includes(permission.id) ? 'Enabled' : 'Disabled' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>

    <div v-else class="empty-state">
      No permissions found for the current filter.
    </div>
  </section>
</template>

<script setup>
import {
  ArrowDown01Icon,
  CheckmarkSquare02Icon,
  FilterHorizontalIcon,
  Key01Icon,
  Search02Icon,
  SquareIcon
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref } from 'vue'

const props = defineProps({
  systemName: {
    type: String,
    default: ''
  },
  permissions: {
    type: Array,
    default: () => []
  },
  assignedPermissionIds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['toggle-permission', 'set-permissions'])
const searchQuery = ref('')

const groupedPermissions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const visiblePermissions = props.permissions.filter((permission) => {
    if (!query) {
      return true
    }

    return (
      permission.name.toLowerCase().includes(query) ||
      permission.description.toLowerCase().includes(query) ||
      (permission.category || 'General').toLowerCase().includes(query)
    )
  })

  const groups = visiblePermissions.reduce((result, permission) => {
    const groupName = permission.category || 'General'

    if (!result[groupName]) {
      result[groupName] = []
    }

    result[groupName].push(permission)
    return result
  }, {})

  return Object.entries(groups).map(([name, items]) => ({
    name,
    items
  }))
})

function getAssignedCount(items) {
  return items.filter((item) => props.assignedPermissionIds.includes(item.id)).length
}

function isGroupFullyAssigned(items) {
  return items.length > 0 && items.every((item) => props.assignedPermissionIds.includes(item.id))
}

function toggleGroup(group) {
  emit('set-permissions', {
    permissionIds: group.items.map((item) => item.id),
    assign: !isGroupFullyAssigned(group.items)
  })
}
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
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.section-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.section-icon {
  color: #f08a1f;
}

.card-title {
  margin: 0 0 4px;
  color: #0f274a;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.section-note {
  margin: 0;
  color: #7a8ca4;
  font-size: 12px;
}

.section-tools {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 260px;
  padding: 0 12px;
  height: 40px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 14px;
}

.search-box input {
  width: 100%;
  color: #1b2b42;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
}

.search-icon {
  color: #8fa1b8;
}

.filter-button {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8fa1b8;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 14px;
}

.permission-groups {
  display: grid;
  gap: 16px;
}

.permission-group {
  border: 1px solid #dce4ee;
  border-radius: 18px;
  overflow: hidden;
  background: #ffffff;
}

.permission-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid #edf1f6;
}

.permission-group__title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.permission-group__title h4 {
  margin: 0;
  color: #193355;
  font-size: 14px;
  font-weight: 700;
}

.permission-group__arrow {
  color: #8093ac;
}

.permission-group__count {
  color: #97a7bc;
  font-size: 11px;
  font-weight: 700;
  background: #f3f6fb;
  border-radius: 999px;
  padding: 2px 8px;
}

.permission-group__select-all {
  color: #2451ef;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: transparent;
  border: none;
  cursor: pointer;
}

.permission-table {
  width: 100%;
  border-collapse: collapse;
}

.permission-table th {
  padding: 12px 18px;
  color: #8a9bb1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
}

.permission-table td {
  padding: 16px 18px;
  color: #5f7087;
  font-size: 14px;
  border-top: 1px solid #edf1f6;
  vertical-align: middle;
}

.permission-table tr.selected {
  background: #fbfdff;
}

.permission-table__status {
  width: 150px;
  text-align: right;
}

.permission-name {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #193355;
  font: inherit;
  background: transparent;
  border: none;
  cursor: pointer;
}

.permission-name strong {
  font-size: 14px;
  font-weight: 700;
}

.permission-check {
  color: #c2cbda;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.selected .permission-check {
  color: #2451ef;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 86px;
  padding: 6px 12px;
  color: #9aa8ba;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: #f7f9fc;
  border: 1px solid #edf1f6;
  border-radius: 999px;
}

.status-pill.active {
  color: #14a36d;
  background: #ecfbf4;
  border-color: #cdeeda;
}

.empty-state {
  padding: 12px 10px;
  color: #7a8ca4;
  font-size: 14px;
  background: #f8fbff;
  border: 1px dashed #dbe5f1;
  border-radius: 12px;
}

@media (max-width: 900px) {
  .section-header {
    flex-direction: column;
  }

  .section-tools {
    width: 100%;
  }

  .search-box {
    min-width: 0;
    flex: 1;
  }
}
</style>
