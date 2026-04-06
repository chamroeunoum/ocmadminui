<template>
  <section class="info-panel">
    <div class="section-header">
      <div class="section-title-row">
        <HugeiconsIcon :icon="Shield01Icon" class="section-icon" :size="22" />
        <div>
          <h3 class="card-title font-moul">តួនាទីក្នុង {{ systemName }}</h3>
          <p class="section-note font-sr">
            ជ្រើសរើសតួនាទីមួយ ឬច្រើនសម្រាប់អ្នកកាន់តំណែងបច្ចុប្បន្ន។
          </p>
        </div>
      </div>

      <div class="section-actions">
        <button
          type="button"
          class="action-button action-button--add font-sr"
          @click="handleAddRole"
        >
          បន្ថែម
        </button>
        <button
          type="button"
          class="action-button font-sr"
          :class="{ 'action-button--active': isDeleteMode }"
          @click="toggleDeleteMode"
        >
          ជ្រើសលុប
        </button>
        <button
          v-if="isDeleteMode"
          type="button"
          class="action-button action-button--danger font-sr"
          :disabled="!selectedRoleIdsForDelete.length"
          @click="deleteSelectedRoles"
        >
          លុប ({{ selectedRoleIdsForDelete.length }})
        </button>
        <span class="assigned-badge font-sr">បានជ្រើស {{ assignedCount }}</span>
      </div>
    </div>

    <div class="role-list">
      <button
        v-for="role in roles"
        :key="role.id"
        type="button"
        class="role-row"
        :class="{
          selected: assignedRoleIds.includes(role.id),
          'delete-selected': selectedRoleIdsForDelete.includes(role.id),
        }"
        @click="handleRoleClick(role.id)"
      >
        <div class="role-row__left">
          <span class="role-check">
            <HugeiconsIcon
              :icon="
                assignedRoleIds.includes(role.id)
                  ? CheckmarkCircle02Icon
                  : CircleIcon
              "
              :size="18"
            />
          </span>
        </div>

        <div class="role-row__body">
          <div class="role-row__top">
            <strong class="font-moul">{{ role.name }}</strong>
            <span
              class="status-pill"
              :class="{ active: assignedRoleIds.includes(role.id) }"
              :aria-label="
                assignedRoleIds.includes(role.id) ? 'selected' : 'not selected'
              "
            />
          </div>

          <p class="font-sr">{{ role.description }}</p>

          <div class="role-permissions">
            <span
              v-for="permission in role.permissions || []"
              :key="permission"
              class="role-permissions__chip font-sr"
            >
              {{ permission }}
            </span>
          </div>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import {
  CheckmarkCircle02Icon,
  CircleIcon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/vue";
import { computed, ref } from "vue";

const props = defineProps({
  systemName: {
    type: String,
    default: "",
  },
  roles: {
    type: Array,
    default: () => [],
  },
  assignedRoleIds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["toggle-role", "add-role", "delete-roles"]);

const assignedCount = computed(() => props.assignedRoleIds.length);
const isDeleteMode = ref(false);
const selectedRoleIdsForDelete = ref([]);

function handleRoleClick(roleId) {
  if (!isDeleteMode.value) {
    emit("toggle-role", roleId);
    return;
  }

  selectedRoleIdsForDelete.value = selectedRoleIdsForDelete.value.includes(
    roleId,
  )
    ? selectedRoleIdsForDelete.value.filter((id) => id !== roleId)
    : [...selectedRoleIdsForDelete.value, roleId];
}

function toggleDeleteMode() {
  isDeleteMode.value = !isDeleteMode.value;
  if (!isDeleteMode.value) {
    selectedRoleIdsForDelete.value = [];
  }
}

function handleAddRole() {
  emit("add-role");
}

function deleteSelectedRoles() {
  if (!selectedRoleIdsForDelete.value.length) {
    return;
  }

  emit("delete-roles", [...selectedRoleIdsForDelete.value]);
  selectedRoleIdsForDelete.value = [];
  isDeleteMode.value = false;
}
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.section-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-icon {
  width: 22px;
  height: 22px;
  color: #2563eb;
  background: #e8f0ff;
  border: 1px solid #cddcff;
  border-radius: 10px;
  padding: 5px;
  stroke-width: 1.9;
}

.card-title {
  margin: 0 0 4px;
  color: #0f274a;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.section-note {
  margin: 0;
  color: #7a8ca4;
  font-size: 12px;
}

.assigned-badge {
  padding: 6px 10px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 500;
  background: #e9f0ff;
  border-radius: 999px;
}

.action-button {
  height: 30px;
  padding: 0 10px;
  color: #4d617b;
  font-size: 12px;
  background: #eef3f9;
  border: 1px solid #d8e2ef;
  border-radius: 10px;
  cursor: pointer;
}

.action-button--add {
  color: #1e4db7;
  background: #eaf1ff;
  border-color: #c9d9fb;
}

.action-button--active {
  color: #173156;
  background: #dfe9f8;
  border-color: #b9cbe8;
}

.action-button--danger {
  color: #a93226;
  background: #fdeeee;
  border-color: #f4c9c9;
}

.action-button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.role-list {
  display: grid;
  gap: 10px;
}

.role-row {
  width: 100%;
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr);
  gap: 12px;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #dfe7f0;
  border-radius: 16px;
  cursor: pointer;
}

.role-row.selected {
  background: #eef5ff;
  border-color: #c7d9ff;
}

.role-row.delete-selected {
  background: #fff1f1;
  border-color: #f0b9b9;
}

.role-row__left {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 2px;
}

.role-check {
  color: #bcc8d8;
  display: inline-flex;
  align-items: center;
}

.role-row.selected .role-check {
  color: #15803d;
}

.role-row__body {
  min-width: 0;
}

.role-row__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.role-row__top strong {
  color: #173156;
  font-size: 13px;
  font-weight: 500;
}

.role-row__body p {
  margin: 8px 0 0;
  color: #66788f;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.6;
}

.role-permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.role-permissions__chip {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  color: #51657f;
  font-size: 11px;
  font-weight: 400;
  background: #f5f7fa;
  border: 1px solid #e1e7ef;
  border-radius: 999px;
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

@media (max-width: 900px) {
  .section-header,
  .role-row__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
