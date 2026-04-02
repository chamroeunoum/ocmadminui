<template>
  <div class="org-dashboard">
    <div class="dashboard-layout">
      <aside class="left-column">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Organization V1.1</p>
              <h2 class="panel-title">Organizations</h2>
              <p class="section-description">
                Select an organization to manage positions, users, roles, and permissions.
              </p>
            </div>

            <span class="panel-badge">{{ totalOrganizations }} orgs</span>
          </div>

          <div class="tree-scroll">
            <OrganizationOnlyTree
              :organizations="organizations"
              :selected-org-id="selectedOrganization.id"
              @select-organization="handleOrganizationSelect"
            />
          </div>
        </section>
      </aside>

      <section class="right-column">
        <section class="panel-card panel-card--hero">
          <p class="eyebrow">Selected Organization</p>
          <h1 class="position-title">{{ selectedOrganization.name }}</h1>
          <p class="section-description">
            Choose a position in this organization, then select a user to manage their access.
          </p>

          <div class="positions-block">
            <div class="section-row">
              <h3 class="section-title">Positions</h3>
              <span class="panel-badge">{{ selectedOrganization.positions?.length || 0 }} total</span>
            </div>

            <div v-if="selectedOrganization.positions?.length" class="position-grid">
              <button
                v-for="position in selectedOrganization.positions"
                :key="position.id"
                type="button"
                class="position-card"
                :class="{ 'position-card--active': position.id === selectedPosition.id }"
                @click="handlePositionSelect(position)"
              >
                <span class="position-card__name">{{ position.name }}</span>
                <span class="position-card__meta">{{ position.people.length }} users</span>
              </button>
            </div>

            <div v-else class="empty-state">
              This organization has no positions yet.
            </div>
          </div>

          <div v-if="selectedPosition" class="users-block">
            <div class="section-row">
              <div>
                <h3 class="section-title">{{ selectedPosition.name }}</h3>
                <p class="section-caption">Users under this position</p>
              </div>
              <span class="panel-badge">{{ selectedPosition.people.length }} users</span>
            </div>

            <div class="user-grid">
              <button
                v-for="user in selectedPosition.people"
                :key="user.email"
                type="button"
                class="user-card"
                :class="{ 'user-card--active': user.email === selectedUserEmail }"
                @click="handleUserSelect(user)"
              >
                <div class="user-card__head">
                  <div class="holder-avatar">{{ user.initials }}</div>
                  <div class="user-copy">
                    <strong>{{ user.name }}</strong>
                    <span>{{ user.employeeId }}</span>
                  </div>
                </div>

                <p class="user-email">
                  <HugeiconsIcon :icon="Mail01Icon" :size="12" />
                  {{ user.email }}
                </p>
              </button>
            </div>
          </div>
        </section>

        <SystemTabs
          :systems="systems"
          v-model:active-system="activeSystem"
        />

        <div class="content-stack">
          <RoleList
            :roles="currentSystem.roles"
            :system-name="currentSystem.name"
            :assigned-role-ids="currentAccess.roleIds"
            @toggle-role="toggleRoleForSelectedUser"
          />

          <PermissionList
            :permissions="currentSystem.permissions"
            :system-name="currentSystem.name"
            :assigned-permission-ids="currentAccess.permissionIds"
            @toggle-permission="togglePermissionForSelectedUser"
            @set-permissions="setPermissionsForSelectedUser"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Mail01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref } from 'vue'
import OrganizationOnlyTree from '@/components/Organization_V1.1/OrganizationOnlyTree.vue'
import PermissionList from '@/components/Organization_V1.1/PermissionList.vue'
import RoleList from '@/components/Organization_V1.1/RoleList.vue'
import SystemTabs from '@/components/Organization_V1.1/SystemTabs.vue'

const organizations = ref([
  {
    id: 1,
    name: 'Global Corp',
    expanded: true,
    positions: [
      {
        id: 11,
        name: 'CEO',
        people: [
          {
            name: 'Sarah Jenkins',
            employeeId: 'EMP-1001',
            email: 'sarah.jenkins@globalcorp.com',
            initials: 'SJ',
            systemAccess: {
              erp: { roleIds: [1], permissionIds: [1, 2] }
            }
          }
        ]
      },
      {
        id: 12,
        name: 'COO',
        people: [
          {
            name: 'Michael Chen',
            employeeId: 'EMP-1002',
            email: 'michael.chen@globalcorp.com',
            initials: 'MC',
            systemAccess: {
              erp: { roleIds: [1, 2], permissionIds: [1, 2, 3] }
            }
          }
        ]
      }
    ],
    children: [
      {
        id: 2,
        name: 'North America Division',
        expanded: true,
        positions: [
          {
            id: 21,
            name: 'Regional Director',
            people: [
              {
                name: 'Elena Rodriguez',
                employeeId: 'EMP-2001',
                email: 'elena.rodriguez@globalcorp.com',
                initials: 'ER',
                systemAccess: {
                  erp: { roleIds: [2], permissionIds: [1, 2] }
                }
              }
            ]
          },
          {
            id: 22,
            name: 'HR Manager',
            people: [
              {
                name: 'David Smith',
                employeeId: 'EMP-2002',
                email: 'david.smith@globalcorp.com',
                initials: 'DS',
                systemAccess: {
                  hr: { roleIds: [4, 5], permissionIds: [4, 5, 6] }
                }
              }
            ]
          }
        ],
        children: [
          {
            id: 3,
            name: 'Tech Hub - Austin',
            expanded: true,
            positions: [
              {
                id: 31,
                name: 'Lead Architect',
                people: [
                  {
                    name: 'Alex Rivera',
                    employeeId: 'EMP-3001',
                    email: 'alex.rivera@globalcorp.com',
                    initials: 'AR',
                    systemAccess: {
                      erp: { roleIds: [1], permissionIds: [1] }
                    }
                  }
                ]
              },
              {
                id: 32,
                name: 'Senior Developer',
                people: [
                  {
                    name: 'Jamie Vough',
                    employeeId: 'EMP-3002',
                    email: 'jamie.v@globalcorp.com',
                    initials: 'JV',
                    systemAccess: {
                      erp: { roleIds: [2], permissionIds: [1, 2] },
                      hr: { roleIds: [6], permissionIds: [6] }
                    }
                  },
                  {
                    name: 'Sam Taylor',
                    employeeId: 'EMP-3003',
                    email: 'sam.t@globalcorp.com',
                    initials: 'ST',
                    systemAccess: {
                      erp: { roleIds: [3], permissionIds: [2, 3] }
                    }
                  }
                ]
              }
            ],
            children: []
          }
        ]
      },
      {
        id: 4,
        name: 'Europe Division',
        positions: [
          {
            id: 41,
            name: 'Finance Controller',
            people: [
              {
                name: 'Laura Bennett',
                employeeId: 'EMP-4001',
                email: 'laura.bennett@globalcorp.com',
                initials: 'LB',
                systemAccess: {
                  erp: { roleIds: [1, 3], permissionIds: [1, 3] }
                }
              },
              {
                name: 'Oliver Grant',
                employeeId: 'EMP-4002',
                email: 'oliver.grant@globalcorp.com',
                initials: 'OG',
                systemAccess: {
                  erp: { roleIds: [3], permissionIds: [2] }
                }
              }
            ]
          }
        ],
        children: []
      },
      {
        id: 5,
        name: 'Shared Services',
        positions: [
          {
            id: 51,
            name: 'Operations Lead',
            people: [
              {
                name: 'Hannah Brooks',
                employeeId: 'EMP-5001',
                email: 'hannah.brooks@globalcorp.com',
                initials: 'HB',
                systemAccess: {
                  erp: { roleIds: [2], permissionIds: [1, 2] }
                }
              },
              {
                name: 'Noah Patel',
                employeeId: 'EMP-5002',
                email: 'noah.patel@globalcorp.com',
                initials: 'NP',
                systemAccess: {
                  hr: { roleIds: [5], permissionIds: [4] }
                }
              }
            ]
          },
          {
            id: 52,
            name: 'Security Analyst',
            people: [
              {
                name: 'Marcus Lee',
                employeeId: 'EMP-5003',
                email: 'marcus.lee@globalcorp.com',
                initials: 'ML',
                systemAccess: {
                  crm: { roleIds: [9], permissionIds: [7, 9] }
                }
              }
            ]
          }
        ],
        children: []
      }
    ]
  }
])

const systems = ref([
  {
    key: 'erp',
    name: 'ERP System',
    roles: [
      { id: 1, name: 'Finance Admin', description: 'Full access to financial modules.' },
      { id: 2, name: 'Inventory Clerk', description: 'Manage stock levels and warehouse operations.' },
      { id: 3, name: 'Procurement Reviewer', description: 'Review purchasing requests and supplier workflow steps.' }
    ],
    permissions: [
      { id: 1, name: 'View Ledger', description: 'Ability to see general ledger entries.', category: 'Finance' },
      { id: 2, name: 'Edit PO', description: 'Create and modify purchase orders.', category: 'Procurement' },
      { id: 3, name: 'Approve Payments', description: 'Authorize outgoing bank transfers.', category: 'Payments' }
    ]
  },
  {
    key: 'hr',
    name: 'HR Portal',
    roles: [
      { id: 4, name: 'HR Administrator', description: 'Maintains employee records, leave rules, and onboarding tasks.' },
      { id: 5, name: 'Department Manager', description: 'Reviews team requests, attendance, and performance notes.' },
      { id: 6, name: 'Employee Self-Service User', description: 'Updates profile details and submits routine HR requests.' }
    ],
    permissions: [
      { id: 4, name: 'Approve Leave Requests', description: 'Lets managers review and approve time-off requests.', category: 'Leave' },
      { id: 5, name: 'Edit Employee Profile', description: 'Allows updates to staff contact details and profile information.', category: 'Profile' },
      { id: 6, name: 'View Attendance Summary', description: 'Shows employee attendance, lateness, and work schedule summaries.', category: 'Attendance' }
    ]
  },
  {
    key: 'crm',
    name: 'CRM',
    roles: [
      { id: 7, name: 'CRM Manager', description: 'Owns customer pipelines, team visibility, and process setup.' },
      { id: 8, name: 'Sales Representative', description: 'Tracks leads, updates contact notes, and manages opportunities.' },
      { id: 9, name: 'Support Agent', description: 'Follows customer requests and keeps issue records up to date.' }
    ],
    permissions: [
      { id: 7, name: 'Create Lead', description: 'Create new lead records and assign them to team members.', category: 'Leads' },
      { id: 8, name: 'Update Opportunity Stage', description: 'Move deals through the pipeline and keep sales progress accurate.', category: 'Pipeline' },
      { id: 9, name: 'Read Customer Timeline', description: 'Access interaction history, notes, and customer activity details.', category: 'Customer Data' }
    ]
  }
])

const activeSystem = ref('erp')
const selectedOrganizationId = ref(1)
const selectedPositionId = ref(11)
const selectedUserEmail = ref('sarah.jenkins@globalcorp.com')

function getAllOrganizations(items) {
  return items.flatMap((item) => [
    item,
    ...getAllOrganizations(item.children || [])
  ])
}

const selectedOrganization = computed(() => {
  const allOrganizations = getAllOrganizations(organizations.value)
  return allOrganizations.find((item) => item.id === selectedOrganizationId.value) || allOrganizations[0]
})

const selectedPosition = computed(() => {
  const positions = selectedOrganization.value?.positions || []
  return positions.find((position) => position.id === selectedPositionId.value) || positions[0] || null
})

const selectedUser = computed(() => {
  const users = selectedPosition.value?.people || []
  return users.find((user) => user.email === selectedUserEmail.value) || users[0] || null
})

const currentSystem = computed(() => {
  return systems.value.find((system) => system.key === activeSystem.value) || systems.value[0]
})

const currentAccess = computed(() => {
  return selectedUser.value?.systemAccess?.[activeSystem.value] || {
    roleIds: [],
    permissionIds: []
  }
})

const totalOrganizations = computed(() => {
  return getAllOrganizations(organizations.value).length
})

function handleOrganizationSelect(organization) {
  selectedOrganizationId.value = organization.id
  selectedPositionId.value = organization.positions?.[0]?.id || null
  selectedUserEmail.value = organization.positions?.[0]?.people?.[0]?.email || ''
}

function handlePositionSelect(position) {
  selectedPositionId.value = position.id
  selectedUserEmail.value = position.people?.[0]?.email || ''
}

function handleUserSelect(user) {
  selectedUserEmail.value = user.email
}

function ensureSelectedUserAccess() {
  if (!selectedUser.value) {
    return null
  }

  if (!selectedUser.value.systemAccess) {
    selectedUser.value.systemAccess = {}
  }

  if (!selectedUser.value.systemAccess[activeSystem.value]) {
    selectedUser.value.systemAccess[activeSystem.value] = {
      roleIds: [],
      permissionIds: []
    }
  }

  return selectedUser.value.systemAccess[activeSystem.value]
}

function toggleRoleForSelectedUser(roleId) {
  const access = ensureSelectedUserAccess()

  if (!access) {
    return
  }

  access.roleIds = access.roleIds.includes(roleId)
    ? access.roleIds.filter((id) => id !== roleId)
    : [...access.roleIds, roleId]
}

function togglePermissionForSelectedUser(permissionId) {
  const access = ensureSelectedUserAccess()

  if (!access) {
    return
  }

  access.permissionIds = access.permissionIds.includes(permissionId)
    ? access.permissionIds.filter((id) => id !== permissionId)
    : [...access.permissionIds, permissionId]
}

function setPermissionsForSelectedUser({ permissionIds, assign }) {
  const access = ensureSelectedUserAccess()

  if (!access) {
    return
  }

  access.permissionIds = assign
    ? Array.from(new Set([...access.permissionIds, ...permissionIds]))
    : access.permissionIds.filter((id) => !permissionIds.includes(id))
}
</script>

<style scoped>
.org-dashboard,
.org-dashboard * {
  text-align: left;
  user-select: text;
}

.org-dashboard {
  min-height: calc(100vh - 56px);
  padding: 18px;
  background: linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%);
  border-radius: 24px;
}

.dashboard-layout {
  display: flex;
  gap: 18px;
}

.left-column {
  width: 28%;
  min-width: 280px;
  display: flex;
  position: sticky;
  top: 16px;
  align-self: flex-start;
}

.left-column .panel-card {
  display: flex;
  flex: 1;
  flex-direction: column;
  height: calc(100vh - 32px);
}

.right-column {
  width: 72%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(20, 36, 66, 0.07);
}

.panel-card--hero {
  padding-bottom: 24px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 6px;
  color: #2753c7;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-title,
.position-title {
  margin: 0;
  color: #163153;
}

.panel-title {
  font-size: 22px;
}

.position-title {
  font-size: 24px;
  font-weight: 800;
}

.section-description {
  margin: 8px 0 0;
  color: #66788f;
  line-height: 1.7;
}

.panel-badge {
  padding: 8px 12px;
  color: #5e728b;
  font-size: 12px;
  font-weight: 700;
  background: #f2f5f9;
  border-radius: 999px;
  white-space: nowrap;
}

.tree-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 6px;
}

.positions-block,
.users-block {
  margin-top: 22px;
}

.section-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.section-title {
  margin: 0;
  color: #163153;
  font-size: 18px;
  font-weight: 800;
}

.section-caption {
  margin: 4px 0 0;
  color: #7a8ca4;
  font-size: 13px;
}

.position-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.position-card {
  display: grid;
  gap: 6px;
  padding: 16px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 16px;
  cursor: pointer;
}

.position-card--active {
  background: #eef4ff;
  border-color: #c8d7f4;
  box-shadow: 0 0 0 2px rgba(84, 133, 255, 0.1);
}

.position-card__name {
  color: #163153;
  font-size: 15px;
  font-weight: 700;
}

.position-card__meta {
  color: #7a8ca4;
  font-size: 12px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.user-card {
  display: grid;
  gap: 10px;
  padding: 16px;
  text-align: left;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 16px;
  cursor: pointer;
}

.user-card--active {
  background: #eef4ff;
  border-color: #c8d7f4;
  box-shadow: 0 0 0 2px rgba(84, 133, 255, 0.1);
}

.user-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.holder-avatar {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0f8f73;
  font-size: 14px;
  font-weight: 700;
  background: #dcfbef;
  border-radius: 999px;
  flex-shrink: 0;
}

.user-copy strong {
  display: block;
  color: #163153;
  font-size: 14px;
  font-weight: 700;
}

.user-copy span {
  display: block;
  margin-top: 4px;
  color: #7a8ca4;
  font-size: 12px;
  font-weight: 700;
}

.user-email {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  color: #7a8ca4;
  font-size: 12px;
}

.empty-state {
  padding: 14px 16px;
  color: #7a8ca4;
  font-size: 14px;
  background: #f8fbff;
  border: 1px dashed #dbe5f1;
  border-radius: 14px;
}

.content-stack {
  display: grid;
  gap: 18px;
}

@media (max-width: 1100px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .left-column,
  .right-column {
    width: 100%;
  }

  .left-column {
    display: block;
    position: static;
  }

  .left-column .panel-card {
    height: auto;
  }

  .position-grid,
  .user-grid {
    grid-template-columns: 1fr;
  }
}
</style>
