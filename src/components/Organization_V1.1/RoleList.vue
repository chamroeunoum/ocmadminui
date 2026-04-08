<template>
  <section class="info-panel">
    <div class="section-header">
      <div class="section-title-row">
        <HugeiconsIcon :icon="Shield01Icon" class="section-icon" :size="22" />
        <div>
          <h3 class="card-title font-moul">តួនាទីក្នុង {{ systemName }}</h3>
          <p class="section-note font-sr">
            ជ្រើសរើសតួនាទីមួយ ឬច្រើនសម្រាប់អ្នកប្រើប្រាស់ដែលបានជ្រើស។
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
          class="action-button action-button--select font-sr"
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
            <div class="role-row__actions">
              <button
                type="button"
                class="role-edit-button font-sr"
                @click.stop="emit('edit-role', role)"
              >
                កែប្រែ
              </button>
              <span
                class="status-pill"
                :class="{ active: assignedRoleIds.includes(role.id) }"
                :aria-label="
                  assignedRoleIds.includes(role.id) ? 'selected' : 'not selected'
                "
              />
            </div>
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

const emit = defineEmits([
  "toggle-role",
  "add-role",
  "delete-roles",
  "edit-role",
]);

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
  text-transform: none;
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
  min-height: 34px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  color: #4d617b;
  font-size: 12px;
  font-weight: 600;
  background: #f8fbff;
  border: 1px solid #dce6f2;
  border-radius: 12px;
  box-shadow: 0 6px 16px rgba(15, 39, 74, 0.05);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease,
    background 0.18s ease, color 0.18s ease;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 10px 20px rgba(15, 39, 74, 0.08);
}

.action-button--add {
  color: #18794e;
  background: #edfdf3;
  border-color: #b7ebc9;
  box-shadow: 0 8px 18px rgba(24, 121, 78, 0.08);
}

.action-button--select {
  color: #b45309;
  background: #fff7ed;
  border-color: #fed7aa;
}

.action-button--active {
  color: #9a3412;
  background: #ffedd5;
  border-color: #fdba74;
  box-shadow: 0 8px 18px rgba(234, 88, 12, 0.1);
}

.action-button--danger {
  color: #c2410c;
  background: #fff1f2;
  border-color: #fecdd3;
  box-shadow: 0 8px 18px rgba(190, 24, 93, 0.08);
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
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
  background: #fff3f2;
  border-color: #f2b1ab;
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

.role-row__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.role-edit-button {
  min-height: 30px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 0 11px;
  color: #2563eb;
  font-size: 11px;
  font-weight: 600;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.08);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}

.role-edit-button:hover {
  transform: translateY(-1px);
  filter: brightness(0.99);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.12);
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
  background: #d7dfe9;
  border-radius: 999px;
}

.status-pill.active {
  background: #22c55e;
}

@media (max-width: 768px) {
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .section-actions {
    justify-content: flex-start;
  }

  .role-row__top {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
