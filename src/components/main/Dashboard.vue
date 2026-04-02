<template>
  <div class="org-dashboard">
    <div class="dashboard-layout">
      <aside class="left-column">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Structure</p>
              <h2 class="panel-title">Organization Tree</h2>
              <p class="section-description">
                Select a position on the left to view holders, roles, and permissions.
              </p>
            </div>

            <span class="panel-badge">{{ totalOrganizations }} orgs</span>
          </div>

          <form class="tree-search" @submit.prevent="applyTreeSearch">
            <label class="tree-search-field">
              <HugeiconsIcon :icon="Search02Icon" class="tree-search-icon" :size="18" />
              <input
                v-model.trim="treeSearchInput"
                type="text"
                placeholder="Search organization or position"
              >
            </label>

            <button type="submit" class="tree-search-button">
              Search
            </button>
          </form>

          <div class="tree-scroll">
            <OrganizationTree
              v-if="filteredOrganizations.length"
              :organizations="filteredOrganizations"
              :selected-position-id="selectedPosition.id"
              @select-position="handlePositionSelect"
            />

            <div v-else class="tree-empty-state">
              <p>No organization found.</p>
              <span>Try a different keyword for organization or position.</span>
            </div>
          </div>
        </section>
      </aside>

      <section class="right-column">
        <section class="position-hero">
          <div class="position-hero-copy">
            <h1 class="position-title">{{ selectedPosition.name }}</h1>
            <p class="position-description">{{ selectedPosition.summary }}</p>
            <p v-if="selectedHolder" class="active-officer">
              Showing access for {{ selectedHolder.name }}
            </p>

            <div class="holders-panel">
              <p class="holders-label">Current Holders</p>

              <div class="holders-list holders-list--inline">
                <article
                  v-for="holder in selectedPosition.people"
                  :key="holder.email"
                  class="holder-card"
                  :class="{ 'holder-card--active': holder.email === selectedHolderEmail }"
                  @click="handleHolderSelect(holder)"
                >
                  <div class="holder-avatar">{{ holder.initials }}</div>

                  <div class="holder-copy">
                    <strong>{{ holder.name }}</strong>
                    <span>
                      <HugeiconsIcon :icon="Mail01Icon" class="holder-email-icon" :size="12" />
                      {{ holder.email }}
                    </span>
                  </div>
                </article>
              </div>
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
            @toggle-role="toggleRoleForSelectedHolder"
          />

          <PermissionList
            :permissions="currentSystem.permissions"
            :system-name="currentSystem.name"
            :assigned-permission-ids="currentAccess.permissionIds"
            @toggle-permission="togglePermissionForSelectedHolder"
            @set-permissions="setPermissionsForSelectedHolder"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import { Mail01Icon, Search02Icon } from '@hugeicons/core-free-icons'
import { computed, ref } from 'vue'
import OrganizationTree from '@/components/organization-management/OrganizationTree.vue'
import PermissionList from '@/components/organization-management/PermissionList.vue'
import RoleList from '@/components/organization-management/RoleList.vue'
import SystemTabs from '@/components/organization-management/SystemTabs.vue'

// Mock data keeps this page simple for now.
// Later, you can replace it with axios calls such as:
// axios.get('/api/admin/organizations')
// axios.get('/api/admin/roles')
// axios.get('/api/admin/permissions')
const organizations = ref([
  {
    id: 1,
    name: 'Global Corp',
    expanded: true,
    positions: [
      {
        id: 11,
        name: 'CEO',
        summary: 'Executive leadership and corporate direction',
        people: [
          {
            name: 'Sarah Jenkins',
            email: 'sarah.jenkins@globalcorp.com',
            initials: 'SJ',
            systemAccess: {
              erp: {
                roleIds: [1],
                permissionIds: [1, 2]
              }
            }
          }
        ],
        systemAccess: {
          erp: {
            roleIds: [1],
            permissionIds: [1, 2]
          }
        }
      },
      {
        id: 12,
        name: 'COO',
        summary: 'Operational strategy and delivery management',
        people: [
          {
            name: 'Michael Chen',
            email: 'michael.chen@globalcorp.com',
            initials: 'MC',
            systemAccess: {
              erp: {
                roleIds: [1, 2],
                permissionIds: [1, 2, 3]
              }
            }
          }
        ],
        systemAccess: {
          erp: {
            roleIds: [1, 2],
            permissionIds: [1, 2, 3]
          }
        }
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
            summary: 'Regional oversight and team performance',
            people: [
              {
                name: 'Elena Rodriguez',
                email: 'elena.rodriguez@globalcorp.com',
                initials: 'ER',
                systemAccess: {
                  erp: {
                    roleIds: [2],
                    permissionIds: [1, 2]
                  }
                }
              }
            ],
            systemAccess: {
              erp: {
                roleIds: [2],
                permissionIds: [1, 2]
              }
            }
          },
          {
            id: 22,
            name: 'HR Manager',
            summary: 'People operations and workforce planning',
            people: [
              {
                name: 'David Smith',
                email: 'david.smith@globalcorp.com',
                initials: 'DS',
                systemAccess: {
                  hr: {
                    roleIds: [4, 5],
                    permissionIds: [4, 5, 6]
                  }
                }
              }
            ],
            systemAccess: {
              hr: {
                roleIds: [4, 5],
                permissionIds: [4, 5, 6]
              }
            }
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
                summary: 'Platform design and technical governance',
                people: [
                  {
                    name: 'Alex Rivera',
                    email: 'alex.rivera@globalcorp.com',
                    initials: 'AR',
                    systemAccess: {
                      erp: {
                        roleIds: [1],
                        permissionIds: [1]
                      }
                    }
                  }
                ],
                systemAccess: {
                  erp: {
                    roleIds: [1],
                    permissionIds: [1]
                  }
                }
              },
              {
                id: 32,
                name: 'Senior Developer',
                summary: 'Core product development',
                people: [
                  {
                    name: 'Jamie Vough',
                    email: 'jamie.v@globalcorp.com',
                    initials: 'JV',
                    systemAccess: {
                      erp: {
                        roleIds: [2],
                        permissionIds: [1, 2]
                      },
                      hr: {
                        roleIds: [6],
                        permissionIds: [6]
                      }
                    }
                  },
                  {
                    name: 'Sam Taylor',
                    email: 'sam.t@globalcorp.com',
                    initials: 'ST',
                    systemAccess: {
                      erp: {
                        roleIds: [3],
                        permissionIds: [2, 3]
                      }
                    }
                  }
                ],
                systemAccess: {
                  erp: {
                    roleIds: [2],
                    permissionIds: [1, 2, 3]
                  },
                  hr: {
                    roleIds: [6],
                    permissionIds: [6]
                  }
                }
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
            summary: 'Financial control and reporting oversight',
            people: [
              {
                name: 'Laura Bennett',
                email: 'laura.bennett@globalcorp.com',
                initials: 'LB',
                systemAccess: {
                  erp: {
                    roleIds: [1, 3],
                    permissionIds: [1, 3]
                  }
                }
              },
              {
                name: 'Oliver Grant',
                email: 'oliver.grant@globalcorp.com',
                initials: 'OG',
                systemAccess: {
                  erp: {
                    roleIds: [3],
                    permissionIds: [2]
                  }
                }
              }
            ],
            systemAccess: {
              erp: {
                roleIds: [1],
                permissionIds: [1, 3]
              }
            }
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
            summary: 'Shared workflow execution and service delivery',
            people: [
              {
                name: 'Hannah Brooks',
                email: 'hannah.brooks@globalcorp.com',
                initials: 'HB',
                systemAccess: {
                  erp: {
                    roleIds: [2],
                    permissionIds: [1, 2]
                  }
                }
              },
              {
                name: 'Noah Patel',
                email: 'noah.patel@globalcorp.com',
                initials: 'NP',
                systemAccess: {
                  hr: {
                    roleIds: [5],
                    permissionIds: [4]
                  }
                }
              }
            ],
            systemAccess: {
              erp: {
                roleIds: [2],
                permissionIds: [1, 2]
              }
            }
          },
          {
            id: 52,
            name: 'Security Analyst',
            summary: 'Security monitoring and incident support',
            people: [
              {
                name: 'Marcus Lee',
                email: 'marcus.lee@globalcorp.com',
                initials: 'ML',
                systemAccess: {
                  crm: {
                    roleIds: [9],
                    permissionIds: [7, 9]
                  }
                }
              }
            ],
            systemAccess: {
              crm: {
                roleIds: [9],
                permissionIds: [7, 9]
              }
            }
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
      {
        id: 1,
        name: 'Finance Admin',
        description: 'Full access to financial modules.'
      },
      {
        id: 2,
        name: 'Inventory Clerk',
        description: 'Manage stock levels and warehouse operations.'
      },
      {
        id: 3,
        name: 'Procurement Reviewer',
        description: 'Review purchasing requests and supplier workflow steps.'
      }
    ],
    permissions: [
      {
        id: 1,
        name: 'View Ledger',
        description: 'Ability to see general ledger entries.',
        category: 'Finance'
      },
      {
        id: 2,
        name: 'Edit PO',
        description: 'Create and modify purchase orders.',
        category: 'Procurement'
      },
      {
        id: 3,
        name: 'Approve Payments',
        description: 'Authorize outgoing bank transfers.',
        category: 'Payments'
      }
    ]
  },
  {
    key: 'hr',
    name: 'HR Portal',
    roles: [
      {
        id: 4,
        name: 'HR Administrator',
        description: 'Maintains employee records, leave rules, and onboarding tasks.'
      },
      {
        id: 5,
        name: 'Department Manager',
        description: 'Reviews team requests, attendance, and performance notes.'
      },
      {
        id: 6,
        name: 'Employee Self-Service User',
        description: 'Updates profile details and submits routine HR requests.'
      }
    ],
    permissions: [
      {
        id: 4,
        name: 'Approve Leave Requests',
        description: 'Lets managers review and approve time-off requests.',
        category: 'Leave'
      },
      {
        id: 5,
        name: 'Edit Employee Profile',
        description: 'Allows updates to staff contact details and profile information.',
        category: 'Profile'
      },
      {
        id: 6,
        name: 'View Attendance Summary',
        description: 'Shows employee attendance, lateness, and work schedule summaries.',
        category: 'Attendance'
      }
    ]
  },
  {
    key: 'crm',
    name: 'CRM',
    roles: [
      {
        id: 7,
        name: 'CRM Manager',
        description: 'Owns customer pipelines, team visibility, and process setup.'
      },
      {
        id: 8,
        name: 'Sales Representative',
        description: 'Tracks leads, updates contact notes, and manages opportunities.'
      },
      {
        id: 9,
        name: 'Support Agent',
        description: 'Follows customer requests and keeps issue records up to date.'
      }
    ],
    permissions: [
      {
        id: 7,
        name: 'Create Lead',
        description: 'Create new lead records and assign them to team members.',
        category: 'Leads'
      },
      {
        id: 8,
        name: 'Update Opportunity Stage',
        description: 'Move deals through the pipeline and keep sales progress accurate.',
        category: 'Pipeline'
      },
      {
        id: 9,
        name: 'Read Customer Timeline',
        description: 'Access interaction history, notes, and customer activity details.',
        category: 'Customer Data'
      }
    ]
  }
])

const activeSystem = ref(systems.value[0].key)
const selectedPositionId = ref(32)
const selectedHolderEmail = ref('jamie.v@globalcorp.com')
const treeSearchInput = ref('')
const treeSearchKeyword = ref('')

const currentSystem = computed(() => {
  return systems.value.find((system) => system.key === activeSystem.value) || systems.value[0]
})

function getAllPositions(items) {
  return items.flatMap((item) => [
    ...(item.positions || []),
    ...getAllPositions(item.children || [])
  ])
}

function filterOrganizations(items, keyword) {
  if (!keyword) {
    return items
  }

  return items.reduce((results, item) => {
    const lowerKeyword = keyword.toLowerCase()
    const matchesOrganization = item.name.toLowerCase().includes(lowerKeyword)
    const matchingPositions = (item.positions || []).filter((position) => {
      return position.name.toLowerCase().includes(lowerKeyword)
    })
    const matchingChildren = filterOrganizations(item.children || [], keyword)

    if (matchesOrganization || matchingPositions.length || matchingChildren.length) {
      results.push({
        ...item,
        expanded: true,
        positions: matchesOrganization ? item.positions || [] : matchingPositions,
        children: matchingChildren
      })
    }

    return results
  }, [])
}

const filteredOrganizations = computed(() => {
  return filterOrganizations(organizations.value, treeSearchKeyword.value)
})

const selectedPosition = computed(() => {
  const positions = getAllPositions(organizations.value)
  return positions.find((position) => position.id === selectedPositionId.value) || positions[0]
})

const selectedHolder = computed(() => {
  const holders = selectedPosition.value?.people || []
  return holders.find((holder) => holder.email === selectedHolderEmail.value) || holders[0] || null
})

const currentAccess = computed(() => {
  return selectedHolder.value?.systemAccess?.[activeSystem.value] || {
    roleIds: [],
    permissionIds: []
  }
})

const totalOrganizations = computed(() => {
  const countItems = (items) => {
    return items.reduce((total, item) => {
      return total + 1 + countItems(item.children || [])
    }, 0)
  }

  return countItems(organizations.value)
})

function handlePositionSelect(position) {
  selectedPositionId.value = position.id
  selectedHolderEmail.value = position.people?.[0]?.email || ''
}

function handleHolderSelect(holder) {
  selectedHolderEmail.value = holder.email
}

function ensureSelectedHolderAccess() {
  if (!selectedHolder.value) {
    return null
  }

  if (!selectedHolder.value.systemAccess) {
    selectedHolder.value.systemAccess = {}
  }

  if (!selectedHolder.value.systemAccess[activeSystem.value]) {
    selectedHolder.value.systemAccess[activeSystem.value] = {
      roleIds: [],
      permissionIds: []
    }
  }

  if (!Array.isArray(selectedHolder.value.systemAccess[activeSystem.value].roleIds)) {
    selectedHolder.value.systemAccess[activeSystem.value].roleIds = []
  }

  if (!Array.isArray(selectedHolder.value.systemAccess[activeSystem.value].permissionIds)) {
    selectedHolder.value.systemAccess[activeSystem.value].permissionIds = []
  }

  return selectedHolder.value.systemAccess[activeSystem.value]
}

function toggleRoleForSelectedHolder(roleId) {
  const access = ensureSelectedHolderAccess()

  if (!access) {
    return
  }

  access.roleIds = access.roleIds.includes(roleId)
    ? access.roleIds.filter((id) => id !== roleId)
    : [...access.roleIds, roleId]
}

function togglePermissionForSelectedHolder(permissionId) {
  const access = ensureSelectedHolderAccess()

  if (!access) {
    return
  }

  access.permissionIds = access.permissionIds.includes(permissionId)
    ? access.permissionIds.filter((id) => id !== permissionId)
    : [...access.permissionIds, permissionId]
}

function setPermissionsForSelectedHolder({ permissionIds, assign }) {
  const access = ensureSelectedHolderAccess()

  if (!access) {
    return
  }

  access.permissionIds = assign
    ? Array.from(new Set([...access.permissionIds, ...permissionIds]))
    : access.permissionIds.filter((id) => !permissionIds.includes(id))
}

function applyTreeSearch() {
  treeSearchKeyword.value = treeSearchInput.value
}
</script>

<style scoped>
.org-dashboard,
.org-dashboard * {
  text-align: left;
  user-select: text;
}

.org-dashboard {
  --page-bg: linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%);
  --text-main: #1b2b42;
  --text-muted: #67778c;
  --primary: #2753c7;
  --primary-soft: #eaf0ff;
  --surface: #ffffff;
  --surface-border: #dce4ee;
  --shadow-soft: 0 18px 45px rgba(20, 36, 66, 0.07);
  min-height: calc(100vh - 56px);
  padding: 18px;
  background: var(--page-bg);
  border-radius: 24px;
}

.panel-card {
  background: var(--surface);
  border: 1px solid var(--surface-border);
  border-radius: 22px;
  box-shadow: var(--shadow-soft);
}

.eyebrow {
  margin: 0 0 6px;
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dashboard-layout {
  display: flex;
  gap: 18px;
  align-items: stretch;
}

.left-column {
  width: 30%;
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
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-card {
  padding: 20px;
}

.tree-search {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.tree-search-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 0 12px;
  background: #f8fbff;
  border: 1px solid #dce4ee;
  border-radius: 14px;
}

.tree-search-field input {
  width: 100%;
  color: #1b2b42;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
}

.tree-search-field input::placeholder {
  color: #8ea0b5;
}

.tree-search-icon {
  width: 17px;
  height: 17px;
  color: #7a8ca4;
  stroke-width: 2;
  flex-shrink: 0;
}

.tree-search-button {
  min-width: 92px;
  padding: 0 16px;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  background: linear-gradient(180deg, #3d63f6 0%, #2d52d9 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.tree-search-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 18px rgba(45, 82, 217, 0.22);
}

.tree-scroll {
  flex: 1;
  min-height: 0;
  padding-right: 6px;
  overflow-y: auto;
}

.tree-scroll::-webkit-scrollbar {
  width: 8px;
}

.tree-scroll::-webkit-scrollbar-thumb {
  background: #d7e0ec;
  border-radius: 999px;
}

.tree-empty-state {
  display: grid;
  gap: 6px;
  padding: 18px 14px;
  color: #5d7390;
  background: #f8fbff;
  border: 1px dashed #d3deee;
  border-radius: 14px;
}

.tree-empty-state p {
  margin: 0;
  color: #183153;
  font-size: 14px;
  font-weight: 700;
}

.tree-empty-state span {
  font-size: 13px;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 18px;
}

.panel-title {
  margin: 0;
  color: var(--text-main);
  font-size: 22px;
}

.section-description {
  margin: 8px 0 0;
  color: var(--text-muted);
  line-height: 1.6;
}

.panel-badge {
  padding: 9px 12px;
  color: #55657a;
  font-size: 12px;
  font-weight: 700;
  background: #f2f5f9;
  border-radius: 999px;
  white-space: nowrap;
}

.panel-badge--active {
  color: var(--primary);
  background: var(--primary-soft);
}

.position-hero {
  padding: 24px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 22px;
  box-shadow: 0 10px 24px rgba(20, 36, 66, 0.08);
}

.position-hero-copy {
  max-width: none;
}

.position-title {
  margin: 0;
  color: #183153;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.1;
}

.position-description {
  margin: 10px 0 0;
  color: #5d7390;
  font-size: 13px;
  line-height: 1.6;
}

.active-officer {
  display: inline-flex;
  align-items: center;
  margin: 12px 0 0;
  padding: 6px 10px;
  color: #2753c7;
  font-size: 12px;
  font-weight: 700;
  background: #edf3ff;
  border-radius: 999px;
}

.holders-panel {
  margin-top: 18px;
}

.holders-label {
  margin: 0 0 10px;
  color: #8a9bb2;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.holders-list {
  display: grid;
  gap: 10px;
}

.holders-list--inline {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-height: 220px;
  overflow-y: auto;
  padding-right: 4px;
}

.holder-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: #f7f9fc;
  border: 1px solid #e5ebf3;
  border-radius: 14px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.holder-card--active {
  background: #eaf2ff;
  border-color: #b8cbef;
  box-shadow: 0 0 0 2px rgba(84, 133, 255, 0.12);
}

.holder-avatar {
  width: 38px;
  height: 38px;
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

.holder-copy {
  min-width: 0;
}

.holder-copy strong {
  display: block;
  color: #183153;
  font-size: 14px;
  font-weight: 700;
}

.holder-copy span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: #8ea3c0;
  font-size: 11px;
}

.holder-email-icon {
  width: 12px;
  height: 12px;
  stroke-width: 2;
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

  .holders-list--inline {
    max-height: none;
    overflow: visible;
  }
}

@media (max-width: 720px) {
  .org-dashboard {
    padding: 12px;
  }

  .position-hero,
  .panel-header {
    flex-direction: column;
  }

  .tree-search {
    flex-direction: column;
  }

  .tree-search-button {
    min-height: 42px;
  }

  .tree-scroll {
    min-height: auto;
    overflow: visible;
    padding-right: 0;
  }
}
</style>
