<template>
  <div class="org-dashboard font-sr">
    <div class="dashboard-layout">
      <aside class="left-column">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow font-moul">អង្គភាព V1.1</p>
              <h2 class="panel-title font-moul">បញ្ជីអង្គភាព</h2>
              <form class="tree-search" @submit.prevent="applyTreeSearch">
                <label class="tree-search-field">
                  <HugeiconsIcon :icon="Search02Icon" class="tree-search-icon" :size="18" />
                  <input
                    v-model.trim="treeSearchInput"
                    type="text"
                    placeholder="ស្វែងរកអង្គភាព"
                  >
                </label>

                <button type="submit" class="tree-search-button font-moul">
                  ស្វែងរក
                </button>
              </form>
              <p class="section-description font-sr">
                ជ្រើសរើសអង្គភាពមួយ ដើម្បីគ្រប់គ្រងតំណែង អ្នកប្រើប្រាស់ តួនាទី និងសិទ្ធិប្រើប្រាស់។
              </p>
            </div>

            <span class="panel-badge font-sr">{{ totalOrganizations }} អង្គភាព</span>
          </div>

          <div class="tree-scroll">
            <OrganizationOnlyTree
              :organizations="filteredOrganizations"
              :selected-org-id="selectedOrganization.id"
              @select-organization="handleOrganizationSelect"
              @node-action="handleNodeAction"
            />
          </div>
        </section>
      </aside>

      <section class="right-column">
        <section class="panel-card panel-card--hero">
          <p class="eyebrow font-moul">អង្គភាពដែលបានជ្រើស</p>
          <h1 class="position-title font-moul">{{ selectedOrganization.name }}</h1>
          <p class="section-description font-sr">
            ជ្រើសរើសតំណែងក្នុងអង្គភាពនេះ បន្ទាប់មកជ្រើសអ្នកប្រើប្រាស់ ដើម្បីគ្រប់គ្រងសិទ្ធិប្រើប្រាស់។
          </p>

          <div class="positions-block">
            <div class="section-row">
              <h3 class="section-title font-moul">តំណែង</h3>
              <span class="panel-badge font-sr">{{ selectedOrganization.positions?.length || 0 }} សរុប</span>
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
                <span class="position-card__name font-moul">{{ position.name }}</span>
                <span class="position-card__meta font-sr">{{ position.people.length }} នាក់</span>
              </button>
            </div>

            <div v-else class="empty-state font-sr">
              អង្គភាពនេះមិនទាន់មានតំណែងនៅឡើយទេ។
            </div>
          </div>

          <div v-if="selectedPosition" class="users-block">
            <div class="section-row">
              <div>
                <h3 class="section-title font-moul">{{ selectedPosition.name }}</h3>
                <p class="section-caption font-sr">អ្នកប្រើប្រាស់នៅក្រោមតំណែងនេះ</p>
              </div>
              <span class="panel-badge font-sr">{{ selectedPosition.people.length }} នាក់</span>
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
                    <strong class="font-sr">{{ user.name }}</strong>
                    <span class="font-sr">{{ user.employeeId }}</span>
                  </div>
                </div>

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

    <div v-if="isNodeModalOpen" class="overlay-backdrop" @click="closeNodeModal">
      <div class="overlay-card" @click.stop>
        <h3 class="overlay-title font-moul">{{ modalTitle }}</h3>
        <p class="overlay-text font-sr">{{ modalDescription }}</p>

        <label v-if="nodeModalAction !== 'delete'" class="overlay-field">
          <span class="font-sr">{{ nodeModalAction === 'add-position' ? 'ឈ្មោះតួនាទី' : 'ឈ្មោះអង្គភាព' }}</span>
          <input v-model.trim="nodeModalName" type="text">
        </label>

        <div class="overlay-actions">
          <button type="button" class="overlay-button overlay-button--ghost font-sr" @click="closeNodeModal">បិទ</button>
          <button type="button" class="overlay-button font-sr" @click="submitNodeAction">រក្សាទុក</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref } from 'vue'
import OrganizationOnlyTree from '@/components/Organization_V1.1/OrganizationOnlyTree.vue'
import PermissionList from '@/components/Organization_V1.1/PermissionList.vue'
import RoleList from '@/components/Organization_V1.1/RoleList.vue'
import SystemTabs from '@/components/Organization_V1.1/SystemTabs.vue'

const organizations = ref([
  {
    id: 1,
    name: 'ក្រុមហ៊ុនសកល',
    expanded: true,
    positions: [
      {
        id: 11,
        name: 'អគ្គនាយក',
        people: [
          {
            name: 'Sarah Jenkins',
            employeeId: 'EMP-1001',
            email: 'sarah.jenkins@globalcorp.com',
            initials: 'SJ',
            systemAccess: {
              erp: { roleIds: [1], permissionIds: [1, 2] },
              organization: { roleIds: [10], permissionIds: [10, 12] }
            }
          }
        ]
      },
      {
        id: 12,
        name: 'នាយកប្រតិបត្តិការ',
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
      },
      {
        id: 13,
        name: 'ប្រធានហិរញ្ញវត្ថុ',
        people: [
          {
            name: 'Lina Sok',
            employeeId: 'EMP-1003',
            email: 'lina.sok@globalcorp.com',
            initials: 'LS',
            systemAccess: {
              erp: { roleIds: [1, 3], permissionIds: [1, 2, 3] }
            }
          }
        ]
      },
      {
        id: 14,
        name: 'ប្រធានព័ត៌មានវិទ្យា',
        people: [
          {
            name: 'Dara Lim',
            employeeId: 'EMP-1004',
            email: 'dara.lim@globalcorp.com',
            initials: 'DL',
            systemAccess: {
              erp: { roleIds: [2], permissionIds: [1, 2] },
              crm: { roleIds: [7], permissionIds: [7, 9] }
            }
          }
        ]
      },
      {
        id: 15,
        name: 'ប្រធានអនុលោមភាព',
        people: [
          {
            name: 'Malis Chan',
            employeeId: 'EMP-1005',
            email: 'malis.chan@globalcorp.com',
            initials: 'MC',
            systemAccess: {
              erp: { roleIds: [3], permissionIds: [1, 3] }
            }
          }
        ]
      },
      {
        id: 16,
        name: 'ប្រធានរដ្ឋបាល',
        people: [
          {
            name: 'Vannak Phan',
            employeeId: 'EMP-1006',
            email: 'vannak.phan@globalcorp.com',
            initials: 'VP',
            systemAccess: {
              hr: { roleIds: [5], permissionIds: [4, 5] }
            }
          }
        ]
      },
      {
        id: 17,
        name: 'ប្រធានយុទ្ធសាស្ត្រ',
        people: [
          {
            name: 'Sophea Kim',
            employeeId: 'EMP-1007',
            email: 'sophea.kim@globalcorp.com',
            initials: 'SK',
            systemAccess: {
              crm: { roleIds: [7], permissionIds: [7, 8, 9] }
            }
          }
        ]
      }
    ],
    children: [
      {
        id: 2,
        name: 'ផ្នែកអាមេរិកខាងជើង',
        expanded: true,
        positions: [
          {
            id: 21,
            name: 'នាយកតំបន់',
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
            name: 'ប្រធានធនធានមនុស្ស',
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
            name: 'មជ្ឈមណ្ឌលបច្ចេកវិទ្យា - Austin',
            expanded: true,
            positions: [
              {
                id: 31,
                name: 'ស្ថាបត្យករនាំមុខ',
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
                name: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់',
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
                  },
                  {
                    name: 'Nora Adams',
                    employeeId: 'EMP-3004',
                    email: 'nora.adams@globalcorp.com',
                    initials: 'NA',
                    systemAccess: {
                      erp: { roleIds: [2], permissionIds: [1, 2] }
                    }
                  },
                  {
                    name: 'Peter Long',
                    employeeId: 'EMP-3005',
                    email: 'peter.long@globalcorp.com',
                    initials: 'PL',
                    systemAccess: {
                      erp: { roleIds: [3], permissionIds: [2] }
                    }
                  },
                  {
                    name: 'Emily Ross',
                    employeeId: 'EMP-3006',
                    email: 'emily.ross@globalcorp.com',
                    initials: 'ER',
                    systemAccess: {
                      hr: { roleIds: [6], permissionIds: [6] }
                    }
                  },
                  {
                    name: 'Leo Martin',
                    employeeId: 'EMP-3007',
                    email: 'leo.martin@globalcorp.com',
                    initials: 'LM',
                    systemAccess: {
                      crm: { roleIds: [8], permissionIds: [7, 8] }
                    }
                  },
                  {
                    name: 'Chloe Turner',
                    employeeId: 'EMP-3008',
                    email: 'chloe.turner@globalcorp.com',
                    initials: 'CT',
                    systemAccess: {
                      erp: { roleIds: [2], permissionIds: [1] }
                    }
                  },
                  {
                    name: 'Ryan Cooper',
                    employeeId: 'EMP-3009',
                    email: 'ryan.cooper@globalcorp.com',
                    initials: 'RC',
                    systemAccess: {
                      crm: { roleIds: [9], permissionIds: [9] }
                    }
                  },
                  {
                    name: 'Mia Carter',
                    employeeId: 'EMP-3010',
                    email: 'mia.carter@globalcorp.com',
                    initials: 'MC',
                    systemAccess: {
                      hr: { roleIds: [6], permissionIds: [5, 6] }
                    }
                  },
                  {
                    name: 'Ethan Hall',
                    employeeId: 'EMP-3011',
                    email: 'ethan.hall@globalcorp.com',
                    initials: 'EH',
                    systemAccess: {
                      erp: { roleIds: [3], permissionIds: [3] }
                    }
                  },
                  {
                    name: 'Sophia Green',
                    employeeId: 'EMP-3012',
                    email: 'sophia.green@globalcorp.com',
                    initials: 'SG',
                    systemAccess: {
                      crm: { roleIds: [8], permissionIds: [7] }
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
        name: 'ផ្នែកអឺរ៉ុប',
        positions: [
          {
            id: 41,
            name: 'អ្នកត្រួតពិនិត្យហិរញ្ញវត្ថុ',
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
        name: 'សេវារួម',
        positions: [
          {
            id: 51,
            name: 'ប្រធានប្រតិបត្តិការ',
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
            name: 'អ្នកវិភាគសន្តិសុខ',
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
    name: 'ប្រព័ន្ធ ERP',
    roles: [
      { id: 1, name: 'អ្នកគ្រប់គ្រងហិរញ្ញវត្ថុ', description: 'អាចប្រើម៉ូឌុលហិរញ្ញវត្ថុទាំងស្រុង។', permissions: ['មើលបញ្ជីគណនី', 'កែប្រែការបញ្ជាទិញ'] },
      { id: 2, name: 'បុគ្គលិកស្តុក', description: 'គ្រប់គ្រងស្តុក និងប្រតិបត្តិការឃ្លាំង។', permissions: ['មើលបញ្ជីគណនី', 'កែប្រែការបញ្ជាទិញ'] },
      { id: 3, name: 'អ្នកត្រួតពិនិត្យការទិញ', description: 'ពិនិត្យសំណើទិញ និងលំហូរការងារអ្នកផ្គត់ផ្គង់។', permissions: ['កែប្រែការបញ្ជាទិញ', 'អនុម័តការទូទាត់'] }
    ],
    permissions: [
      { id: 1, name: 'មើលបញ្ជីគណនី', description: 'អាចមើលទិន្នន័យក្នុងសៀវភៅគណនីទូទៅ។', category: 'ហិរញ្ញវត្ថុ' },
      { id: 2, name: 'កែប្រែការបញ្ជាទិញ', description: 'បង្កើត និងកែប្រែពាក្យបញ្ជាទិញ។', category: 'ការទិញ' },
      { id: 3, name: 'អនុម័តការទូទាត់', description: 'អនុញ្ញាតការផ្ទេរប្រាក់ចេញ។', category: 'ការទូទាត់' }
    ]
  },
  {
    key: 'hr',
    name: 'ប្រព័ន្ធធនធានមនុស្ស',
    roles: [
      { id: 4, name: 'អ្នកគ្រប់គ្រងធនធានមនុស្ស', description: 'គ្រប់គ្រងកំណត់ត្រាបុគ្គលិក ច្បាប់ឈប់សម្រាក និងការចូលបម្រើការងារ។', permissions: ['អនុម័តការឈប់សម្រាក', 'កែប្រែប្រវត្តិបុគ្គលិក'] },
      { id: 5, name: 'ប្រធានផ្នែក', description: 'ពិនិត្យសំណើក្រុម វត្តមាន និងកំណត់ត្រាលទ្ធផលការងារ។', permissions: ['អនុម័តការឈប់សម្រាក', 'មើលរបាយការណ៍វត្តមាន'] },
      { id: 6, name: 'អ្នកប្រើសេវាខ្លួនឯង', description: 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួន និងដាក់សំណើធម្មតាទៅ HR។', permissions: ['កែប្រែប្រវត្តិបុគ្គលិក', 'មើលរបាយការណ៍វត្តមាន'] }
    ],
    permissions: [
      { id: 4, name: 'អនុម័តការឈប់សម្រាក', description: 'អនុញ្ញាតឲ្យអ្នកគ្រប់គ្រងពិនិត្យ និងអនុម័តសំណើឈប់សម្រាក។', category: 'ការឈប់សម្រាក' },
      { id: 5, name: 'កែប្រែប្រវត្តិបុគ្គលិក', description: 'អនុញ្ញាតឲ្យកែប្រែព័ត៌មានទំនាក់ទំនង និងប្រវត្តិបុគ្គលិក។', category: 'ប្រវត្តិ' },
      { id: 6, name: 'មើលរបាយការណ៍វត្តមាន', description: 'បង្ហាញវត្តមាន ការយឺតយ៉ាវ និងកាលវិភាគការងារ។', category: 'វត្តមាន' }
    ]
  },
  {
    key: 'crm',
    name: 'ប្រព័ន្ធ CRM',
    roles: [
      { id: 7, name: 'អ្នកគ្រប់គ្រង CRM', description: 'គ្រប់គ្រងលំហូរអតិថិជន ការមើលឃើញរបស់ក្រុម និងការកំណត់ដំណើរការ។', permissions: ['បង្កើតអតិថិជនសក្តានុពល', 'មើលប្រវត្តិអតិថិជន'] },
      { id: 8, name: 'អ្នកលក់', description: 'តាមដានអតិថិជនសក្តានុពល កែប្រែកំណត់ចំណាំ និងគ្រប់គ្រងឱកាសលក់។', permissions: ['បង្កើតអតិថិជនសក្តានុពល', 'កែប្រែដំណាក់កាលឱកាស'] },
      { id: 9, name: 'ភ្នាក់ងារគាំទ្រ', description: 'តាមដានសំណើអតិថិជន និងធ្វើបច្ចុប្បន្នភាពកំណត់ត្រាបញ្ហា។', permissions: ['មើលប្រវត្តិអតិថិជន'] }
    ],
    permissions: [
      { id: 7, name: 'បង្កើតអតិថិជនសក្តានុពល', description: 'បង្កើតកំណត់ត្រាអតិថិជនសក្តានុពលថ្មី និងចែកជូនក្រុម។', category: 'អតិថិជនសក្តានុពល' },
      { id: 8, name: 'កែប្រែដំណាក់កាលឱកាស', description: 'ធ្វើបច្ចុប្បន្នភាពដំណាក់កាលលក់ និងភាពរីកចម្រើន។', category: 'លំហូរលក់' },
      { id: 9, name: 'មើលប្រវត្តិអតិថិជន', description: 'អាចមើលប្រវត្តិទំនាក់ទំនង កំណត់ចំណាំ និងសកម្មភាពអតិថិជន។', category: 'ទិន្នន័យអតិថិជន' }
    ]
  },
  {
    key: 'organization',
    name: 'អង្គភាព',
    roles: [
      { id: 10, name: 'អ្នកគ្រប់គ្រងអង្គភាព', description: 'គ្រប់គ្រងរចនាសម្ព័ន្ធអង្គភាព តំណែង និងអ្នកកាន់តំណែង។', permissions: ['បន្ថែមអង្គភាព', 'កែប្រែតួនាទី'] },
      { id: 11, name: 'អ្នកសម្របសម្រួលតួនាទី', description: 'តាមដានតួនាទី និងរៀបចំការចាត់តាំងអ្នកប្រើប្រាស់ក្នុងអង្គភាព។', permissions: ['កែប្រែតួនាទី', 'មើលរចនាសម្ព័ន្ធអង្គភាព'] },
      { id: 12, name: 'អ្នកមើលរចនាសម្ព័ន្ធ', description: 'អាចមើលអង្គភាពរង តំណែង និងព័ត៌មានសង្ខេបរបស់អង្គភាព។', permissions: ['មើលរចនាសម្ព័ន្ធអង្គភាព'] }
    ],
    permissions: [
      { id: 10, name: 'បន្ថែមអង្គភាព', description: 'អនុញ្ញាតឲ្យបង្កើតអង្គភាពថ្មី ឬអង្គភាពរងក្នុងរចនាសម្ព័ន្ធ។', category: 'អង្គភាព' },
      { id: 11, name: 'កែប្រែតួនាទី', description: 'អនុញ្ញាតឲ្យបន្ថែម កែប្រែ ឬចាត់តាំងតួនាទីក្នុងអង្គភាព។', category: 'តួនាទី' },
      { id: 12, name: 'មើលរចនាសម្ព័ន្ធអង្គភាព', description: 'អាចមើលមែកធាងអង្គភាព តំណែង និងព័ត៌មានដែលពាក់ព័ន្ធ។', category: 'មើលទិន្នន័យ' }
    ]
  }
])

const activeSystem = ref('erp')
const selectedOrganizationId = ref(1)
const selectedPositionId = ref(11)
const selectedUserEmail = ref('sarah.jenkins@globalcorp.com')
const treeSearchInput = ref('')
const treeSearchKeyword = ref('')
const isNodeModalOpen = ref(false)
const nodeModalAction = ref('')
const nodeModalTargetId = ref(null)
const nodeModalName = ref('')

function getAllOrganizations(items) {
  return items.flatMap((item) => [
    item,
    ...getAllOrganizations(item.children || [])
  ])
}

function filterOrganizations(items, keyword) {
  if (!keyword) {
    return items
  }

  return items.reduce((result, item) => {
    const matches = item.name.toLowerCase().includes(keyword.toLowerCase())
    const matchingChildren = filterOrganizations(item.children || [], keyword)

    if (matches || matchingChildren.length) {
      result.push({
        ...item,
        expanded: true,
        children: matchingChildren
      })
    }

    return result
  }, [])
}

const filteredOrganizations = computed(() => {
  return filterOrganizations(organizations.value, treeSearchKeyword.value)
})

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

const modalTitle = computed(() => {
  if (nodeModalAction.value === 'add-position') {
    return 'បន្ថែមតួនាទី'
  }

  if (nodeModalAction.value === 'add-organization') {
    return 'បន្ថែមអង្គភាព'
  }

  return 'លុបអង្គភាព'
})

const modalDescription = computed(() => {
  if (nodeModalAction.value === 'delete') {
    return 'តើអ្នកចង់លុបអង្គភាពនេះមែនទេ?'
  }

  return 'សូមបំពេញព័ត៌មានខាងក្រោម។'
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

function applyTreeSearch() {
  treeSearchKeyword.value = treeSearchInput.value
}

function findOrganizationById(items, id) {
  for (const item of items) {
    if (item.id === id) {
      return item
    }

    const match = findOrganizationById(item.children || [], id)
    if (match) {
      return match
    }
  }

  return null
}

function removeOrganizationById(items, id) {
  return items
    .filter((item) => item.id !== id)
    .map((item) => ({
      ...item,
      children: removeOrganizationById(item.children || [], id)
    }))
}

function ensureOrganizationSelection() {
  const allOrganizations = getAllOrganizations(organizations.value)
  const currentOrganization = allOrganizations.find((item) => item.id === selectedOrganizationId.value)
  const fallbackOrganization = currentOrganization || allOrganizations[0] || null

  selectedOrganizationId.value = fallbackOrganization?.id || null
  selectedPositionId.value = fallbackOrganization?.positions?.[0]?.id || null
  selectedUserEmail.value = fallbackOrganization?.positions?.[0]?.people?.[0]?.email || ''
}

function handleNodeAction({ action, node }) {
  nodeModalAction.value = action
  nodeModalTargetId.value = node.id
  nodeModalName.value = ''
  isNodeModalOpen.value = true
}

function closeNodeModal() {
  isNodeModalOpen.value = false
  nodeModalAction.value = ''
  nodeModalTargetId.value = null
  nodeModalName.value = ''
}

function submitNodeAction() {
  const target = findOrganizationById(organizations.value, nodeModalTargetId.value)

  if (!target) {
    closeNodeModal()
    return
  }

  if (nodeModalAction.value === 'add-position' && nodeModalName.value) {
    const newPosition = {
      id: Date.now(),
      name: nodeModalName.value,
      people: []
    }

    target.positions = [...(target.positions || []), newPosition]
    selectedOrganizationId.value = target.id
    selectedPositionId.value = newPosition.id
    selectedUserEmail.value = ''
  }

  if (nodeModalAction.value === 'add-organization' && nodeModalName.value) {
    const newOrganization = {
      id: Date.now(),
      name: nodeModalName.value,
      expanded: true,
      positions: [],
      children: []
    }

    target.children = [...(target.children || []), newOrganization]
  }

  if (nodeModalAction.value === 'delete') {
    organizations.value = removeOrganizationById(organizations.value, nodeModalTargetId.value)
    ensureOrganizationSelection()
  }

  closeNodeModal()
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
  padding: 18px 20px;
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
  font-size: 20px;
  font-weight: 500;
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
  font-weight: 500;
  background: linear-gradient(180deg, #3d63f6 0%, #2d52d9 100%);
  border: none;
  border-radius: 14px;
  cursor: pointer;
}

.positions-block,
.users-block {
  margin-top: 18px;
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
  font-size: 16px;
  font-weight: 500;
}

.section-caption {
  margin: 4px 0 0;
  color: #7a8ca4;
  font-size: 13px;
}

.position-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.position-card {
  display: grid;
  gap: 6px;
  width: auto;
  min-width: 180px;
  padding: 14px 16px;
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
  font-size: 14px;
  font-weight: 500;
}

.position-card__meta {
  color: #7a8ca4;
  font-size: 11px;
}

.user-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.user-card {
  display: grid;
  gap: 10px;
  padding: 14px;
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
  font-size: 13px;
  font-weight: 500;
}

.user-copy span {
  display: block;
  margin-top: 4px;
  color: #7a8ca4;
  font-size: 12px;
  font-weight: 400;
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

.overlay-backdrop {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.28);
  z-index: 100;
}

.overlay-card {
  width: min(420px, 100%);
  padding: 18px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 18px;
  box-shadow: 0 18px 40px rgba(20, 36, 66, 0.18);
}

.overlay-title {
  margin: 0;
  color: #173156;
  font-size: 18px;
  font-weight: 500;
}

.overlay-text {
  margin: 10px 0 0;
  color: #6a7d94;
  font-size: 13px;
}

.overlay-field {
  display: grid;
  gap: 8px;
  margin-top: 16px;
}

.overlay-field span {
  color: #50657f;
  font-size: 12px;
}

.overlay-field input {
  width: 100%;
  height: 42px;
  padding: 0 12px;
  color: #173156;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 12px;
  outline: none;
}

.overlay-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.overlay-button {
  min-width: 92px;
  height: 40px;
  padding: 0 14px;
  color: #ffffff;
  font-size: 12px;
  background: #2563eb;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.overlay-button--ghost {
  color: #4b627d;
  background: #eef3f9;
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

  .tree-search {
    flex-direction: column;
  }
}
</style>
