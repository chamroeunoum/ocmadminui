<template>
  <section class="info-panel">
    <div class="section-header">
      <div class="section-title-row">
        <HugeiconsIcon :icon="Key01Icon" class="section-icon" :size="22" />
        <div>
          <h3 class="card-title font-moul">សិទ្ធិលម្អិត</h3>
          <p class="section-note font-sr">គ្រប់គ្រងសិទ្ធិលម្អិតសម្រាប់មុខងារទាំងអស់ក្នុងប្រព័ន្ធ។</p>
        </div>
      </div>

      <div class="section-tools">
        <label class="search-box">
          <HugeiconsIcon :icon="Search02Icon" class="search-icon" :size="16" />
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="ស្វែងរកសិទ្ធិ..."
          >
        </label>

        <button type="button" class="filter-button">
          <HugeiconsIcon :icon="FilterHorizontalIcon" :size="16" />
        </button>
      </div>
    </div>

    <div v-if="filteredPermissions.length" class="permission-card-grid">
      <button
        v-for="permission in filteredPermissions"
        :key="permission.id"
        type="button"
        class="permission-card"
        :class="{ selected: assignedPermissionIds.includes(permission.id) }"
        @click="$emit('toggle-permission', permission.id)"
      >
        <div class="permission-card__head">
          <span class="permission-check">
            <HugeiconsIcon
              :icon="assignedPermissionIds.includes(permission.id) ? CheckmarkSquare02Icon : SquareIcon"
              :size="18"
            />
          </span>

          <span
            class="status-pill"
            :class="{ active: assignedPermissionIds.includes(permission.id) }"
            :aria-label="assignedPermissionIds.includes(permission.id) ? 'selected' : 'not selected'"
          />
        </div>

        <div class="permission-card__body">
          <strong class="font-moul">{{ permission.name }}</strong>
          <p class="font-sr">{{ permission.description }}</p>
        </div>
      </button>
    </div>

    <div v-else class="empty-state font-sr">
      មិនមានសិទ្ធិសមស្របនឹងពាក្យស្វែងរកនេះទេ។
    </div>
  </section>
</template>

<script setup>
import { CheckmarkSquare02Icon, FilterHorizontalIcon, Key01Icon, Search02Icon, SquareIcon } from '@hugeicons/core-free-icons'
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

defineEmits(['toggle-permission', 'set-permissions'])
const searchQuery = ref('')

const filteredPermissions = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return props.permissions.filter((permission) => {
    if (!query) {
      return true
    }

    return (
      permission.name.toLowerCase().includes(query) ||
      permission.description.toLowerCase().includes(query) ||
      (permission.category || '').toLowerCase().includes(query)
    )
  })
})
</script>

<style scoped>
.info-panel,
.info-panel * {
  text-align: left;
  user-select: text;
}

.info-panel {
  padding: 16px;
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
  margin-bottom: 16px;
}

.section-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.section-icon {
  color: #f08a1f;
  background: #fff3e8;
  border: 1px solid #ffd8b2;
  border-radius: 10px;
  padding: 5px;
}

.card-title {
  margin: 0 0 4px;
  color: #0f274a;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-transform: none;
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

.permission-card-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.permission-card {
  display: grid;
  gap: 10px;
  padding: 13px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #e0e8f2;
  border-radius: 14px;
  cursor: pointer;
}

.permission-card.selected {
  background: #eef5ff;
  border-color: #c7d9ff;
}

.permission-card__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.permission-card__body strong {
  display: block;
  margin-bottom: 6px;
  color: #193355;
  font-size: 13px;
  font-weight: 500;
}

.permission-card__body p {
  margin: 0;
  color: #64758a;
  font-size: 12px;
  line-height: 1.6;
}

.permission-check {
  color: #c2cbda;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.selected .permission-check {
  color: #15803d;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  min-width: 12px;
  height: 12px;
  padding: 0;
  color: transparent;
  font-size: 0;
  font-weight: 400;
  background: #f3f5f8;
  border: 1px solid #dfe5ed;
  border-radius: 999px;
}

.status-pill.active {
  color: #166534;
  background: #bbf7d0;
  border-color: #4ade80;
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

  .permission-card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
