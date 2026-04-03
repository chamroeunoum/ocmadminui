<template>
  <div class="org-dashboard font-sr">
    <div class="dashboard-layout">
      <aside class="left-column">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow font-moul">រចនាសម្ព័ន្ធ</p>
              <h2 class="panel-title font-moul">មែកធាងអង្គភាព</h2>
              <form class="tree-search" @submit.prevent="applyTreeSearch">
                <label class="tree-search-field">
                  <HugeiconsIcon :icon="Search02Icon" class="tree-search-icon" :size="18" />
                  <input
                    v-model.trim="treeSearchInput"
                    type="text"
                    placeholder="ស្វែងរកអង្គភាព ឬតំណែង"
                  >
                </label>

                <button type="submit" class="tree-search-button font-moul">
                  ស្វែងរក
                </button>
              </form>
              <p class="section-description font-sr">
                ជ្រើសរើសតំណែងនៅខាងឆ្វេង ដើម្បីមើលអ្នកកាន់តំណែង តួនាទី និងសិទ្ធិប្រើប្រាស់។
              </p>
            </div>

            <span class="panel-badge font-sr">{{ totalOrganizations }} អង្គភាព</span>
          </div>

          <div class="tree-scroll">
            <OrganizationTree
              v-if="filteredOrganizations.length"
              :organizations="filteredOrganizations"
              :selected-position-id="selectedPosition.id"
              @select-position="handlePositionSelect"
              @node-action="handleNodeAction"
            />

            <div v-else class="tree-empty-state font-sr">
              <p class="font-moul">រកមិនឃើញអង្គភាពទេ។</p>
              <span>សូមសាកល្បងពាក្យស្វែងរកផ្សេងសម្រាប់អង្គភាព ឬតំណែង។</span>
            </div>
          </div>
        </section>
      </aside>

      <section class="right-column">
        <section class="position-hero">
          <div class="position-hero-copy">
            <h1 class="position-title font-moul">{{ selectedPosition.name }}</h1>

            <div class="holders-panel">
              <p class="holders-label font-moul">អ្នកកាន់តំណែងបច្ចុប្បន្ន</p>

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
                    <strong class="font-sr">{{ holder.name }}</strong>
                    <span class="holder-id font-sr">{{ holder.employeeId }}</span>
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

    <div v-if="isNodeModalOpen" class="overlay-backdrop" @click="closeNodeModal">
      <div class="overlay-card" @click.stop>
        <h3 class="overlay-title font-moul">{{ modalTitle }}</h3>
        <p class="overlay-text font-sr">{{ modalDescription }}</p>

        <label v-if="nodeModalAction !== 'delete'" class="overlay-field">
          <span class="font-sr">{{ nodeModalAction === 'add-position' ? 'ឈ្មោះតួនាទី' : 'ឈ្មោះអង្គភាព' }}</span>
          <input v-model.trim="nodeModalName" type="text">
        </label>

        <div class="overlay-actions">
          <button type="button" class="overlay-button overlay-button--ghost font-sr" @click="closeNodeModal">
            បិទ
          </button>
          <button type="button" class="overlay-button font-sr" @click="submitNodeAction">
            រក្សាទុក
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { HugeiconsIcon } from '@hugeicons/vue'
import { Search02Icon } from '@hugeicons/core-free-icons'
import { computed, ref } from 'vue'
import OrganizationTree from '@/components/Organization_with_HR/OrganizationTree.vue'
import PermissionList from '@/components/Organization_with_HR/PermissionList.vue'
import RoleList from '@/components/Organization_with_HR/RoleList.vue'
import SystemTabs from '@/components/Organization_with_HR/SystemTabs.vue'

// Mock data keeps this page simple for now.
// Later, you can replace it with axios calls such as:
// axios.get('/api/admin/organizations')
// axios.get('/api/admin/roles')
// axios.get('/api/admin/permissions')
const organizations = ref([
  {
    id: 1,
    name: 'ក្រុមហ៊ុនសកល',
    expanded: true,
    positions: [
      {
        id: 11,
        name: 'អគ្គនាយក',
        summary: 'ដឹកនាំយុទ្ធសាស្ត្រ និងទិសដៅសរុបរបស់ស្ថាប័ន',
        people: [
          {
            name: 'Sarah Jenkins',
            employeeId: 'EMP-1001',
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
        name: 'នាយកប្រតិបត្តិការ',
        summary: 'គ្រប់គ្រងយុទ្ធសាស្ត្រប្រតិបត្តិការ និងការអនុវត្តការងារ',
        people: [
          {
            name: 'Michael Chen',
            employeeId: 'EMP-1002',
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
        name: 'ផ្នែកអាមេរិកខាងជើង',
        expanded: true,
        positions: [
          {
            id: 21,
            name: 'នាយកតំបន់',
            summary: 'ត្រួតពិនិត្យការងារតំបន់ និងលទ្ធផលក្រុម',
            people: [
              {
                name: 'Elena Rodriguez',
                employeeId: 'EMP-2001',
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
            name: 'ប្រធានធនធានមនុស្ស',
            summary: 'គ្រប់គ្រងបុគ្គលិក និងផែនការកម្លាំងការងារ',
            people: [
              {
                name: 'David Smith',
                employeeId: 'EMP-2002',
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
            name: 'មជ្ឈមណ្ឌលបច្ចេកវិទ្យា - Austin',
            expanded: true,
            positions: [
              {
                id: 31,
                name: 'ស្ថាបត្យករនាំមុខ',
                summary: 'រចនាវេទិកា និងគ្រប់គ្រងស្តង់ដារបច្ចេកទេស',
                people: [
                  {
                    name: 'Alex Rivera',
                    employeeId: 'EMP-3001',
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
                name: 'អ្នកអភិវឌ្ឍន៍ជាន់ខ្ពស់',
                summary: 'អភិវឌ្ឍប្រព័ន្ធស្នូល និងមុខងារសំខាន់ៗ',
                people: [
                  {
                    name: 'Jamie Vough',
                    employeeId: 'EMP-3002',
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
                      },
                      organization: {
                        roleIds: [10],
                        permissionIds: [10, 11]
                      }
                    }
                  },
                  {
                    name: 'Sam Taylor',
                    employeeId: 'EMP-3003',
                    email: 'sam.t@globalcorp.com',
                    initials: 'ST',
                    systemAccess: {
                      erp: {
                        roleIds: [3],
                        permissionIds: [2, 3]
                      }
                    }
                  },
                  {
                    name: 'Nora Adams',
                    employeeId: 'EMP-3004',
                    email: 'nora.adams@globalcorp.com',
                    initials: 'NA',
                    systemAccess: {
                      erp: {
                        roleIds: [2],
                        permissionIds: [1, 2]
                      }
                    }
                  },
                  {
                    name: 'Peter Long',
                    employeeId: 'EMP-3005',
                    email: 'peter.long@globalcorp.com',
                    initials: 'PL',
                    systemAccess: {
                      erp: {
                        roleIds: [3],
                        permissionIds: [2]
                      }
                    }
                  },
                  {
                    name: 'Emily Ross',
                    employeeId: 'EMP-3006',
                    email: 'emily.ross@globalcorp.com',
                    initials: 'ER',
                    systemAccess: {
                      hr: {
                        roleIds: [6],
                        permissionIds: [6]
                      }
                    }
                  },
                  {
                    name: 'Leo Martin',
                    employeeId: 'EMP-3007',
                    email: 'leo.martin@globalcorp.com',
                    initials: 'LM',
                    systemAccess: {
                      crm: {
                        roleIds: [8],
                        permissionIds: [7, 8]
                      }
                    }
                  },
                  {
                    name: 'Chloe Turner',
                    employeeId: 'EMP-3008',
                    email: 'chloe.turner@globalcorp.com',
                    initials: 'CT',
                    systemAccess: {
                      erp: {
                        roleIds: [2],
                        permissionIds: [1]
                      }
                    }
                  },
                  {
                    name: 'Ryan Cooper',
                    employeeId: 'EMP-3009',
                    email: 'ryan.cooper@globalcorp.com',
                    initials: 'RC',
                    systemAccess: {
                      crm: {
                        roleIds: [9],
                        permissionIds: [9]
                      }
                    }
                  },
                  {
                    name: 'Mia Carter',
                    employeeId: 'EMP-3010',
                    email: 'mia.carter@globalcorp.com',
                    initials: 'MC',
                    systemAccess: {
                      hr: {
                        roleIds: [6],
                        permissionIds: [5, 6]
                      }
                    }
                  },
                  {
                    name: 'Ethan Hall',
                    employeeId: 'EMP-3011',
                    email: 'ethan.hall@globalcorp.com',
                    initials: 'EH',
                    systemAccess: {
                      erp: {
                        roleIds: [3],
                        permissionIds: [3]
                      }
                    }
                  },
                  {
                    name: 'Sophia Green',
                    employeeId: 'EMP-3012',
                    email: 'sophia.green@globalcorp.com',
                    initials: 'SG',
                    systemAccess: {
                      crm: {
                        roleIds: [8],
                        permissionIds: [7]
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
        name: 'ផ្នែកអឺរ៉ុប',
        positions: [
          {
            id: 41,
            name: 'អ្នកត្រួតពិនិត្យហិរញ្ញវត្ថុ',
            summary: 'ត្រួតពិនិត្យហិរញ្ញវត្ថុ និងរបាយការណ៍',
            people: [
              {
                name: 'Laura Bennett',
                employeeId: 'EMP-4001',
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
                employeeId: 'EMP-4002',
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
        name: 'សេវារួម',
        positions: [
          {
            id: 51,
            name: 'ប្រធានប្រតិបត្តិការ',
            summary: 'គ្រប់គ្រងដំណើរការរួម និងការផ្តល់សេវា',
            people: [
              {
                name: 'Hannah Brooks',
                employeeId: 'EMP-5001',
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
                employeeId: 'EMP-5002',
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
            name: 'អ្នកវិភាគសន្តិសុខ',
            summary: 'ត្រួតពិនិត្យសន្តិសុខ និងគាំទ្រហេតុការណ៍',
            people: [
              {
                name: 'Marcus Lee',
                employeeId: 'EMP-5003',
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
    name: 'ប្រព័ន្ធ ERP',
    roles: [
      {
        id: 1,
        name: 'អ្នកគ្រប់គ្រងហិរញ្ញវត្ថុ',
        description: 'អាចប្រើម៉ូឌុលហិរញ្ញវត្ថុទាំងស្រុង។',
        permissions: ['មើលបញ្ជីគណនី', 'កែប្រែការបញ្ជាទិញ']
      },
      {
        id: 2,
        name: 'បុគ្គលិកស្តុក',
        description: 'គ្រប់គ្រងស្តុក និងប្រតិបត្តិការឃ្លាំង។',
        permissions: ['មើលបញ្ជីគណនី', 'កែប្រែការបញ្ជាទិញ']
      },
      {
        id: 3,
        name: 'អ្នកត្រួតពិនិត្យការទិញ',
        description: 'ពិនិត្យសំណើទិញ និងលំហូរការងារអ្នកផ្គត់ផ្គង់។',
        permissions: ['កែប្រែការបញ្ជាទិញ', 'អនុម័តការទូទាត់']
      }
    ],
    permissions: [
      {
        id: 1,
        name: 'មើលបញ្ជីគណនី',
        description: 'អាចមើលទិន្នន័យក្នុងសៀវភៅគណនីទូទៅ។',
        category: 'ហិរញ្ញវត្ថុ'
      },
      {
        id: 2,
        name: 'កែប្រែការបញ្ជាទិញ',
        description: 'បង្កើត និងកែប្រែពាក្យបញ្ជាទិញ។',
        category: 'ការទិញ'
      },
      {
        id: 3,
        name: 'អនុម័តការទូទាត់',
        description: 'អនុញ្ញាតការផ្ទេរប្រាក់ចេញ។',
        category: 'ការទូទាត់'
      }
    ]
  },
  {
    key: 'hr',
    name: 'ប្រព័ន្ធធនធានមនុស្ស',
    roles: [
      {
        id: 4,
        name: 'អ្នកគ្រប់គ្រងធនធានមនុស្ស',
        description: 'គ្រប់គ្រងកំណត់ត្រាបុគ្គលិក ច្បាប់ឈប់សម្រាក និងការចូលបម្រើការងារ។',
        permissions: ['អនុម័តការឈប់សម្រាក', 'កែប្រែប្រវត្តិបុគ្គលិក']
      },
      {
        id: 5,
        name: 'ប្រធានផ្នែក',
        description: 'ពិនិត្យសំណើក្រុម វត្តមាន និងកំណត់ត្រាលទ្ធផលការងារ។',
        permissions: ['អនុម័តការឈប់សម្រាក', 'មើលរបាយការណ៍វត្តមាន']
      },
      {
        id: 6,
        name: 'អ្នកប្រើសេវាខ្លួនឯង',
        description: 'កែប្រែព័ត៌មានផ្ទាល់ខ្លួន និងដាក់សំណើធម្មតាទៅ HR។',
        permissions: ['កែប្រែប្រវត្តិបុគ្គលិក', 'មើលរបាយការណ៍វត្តមាន']
      }
    ],
    permissions: [
      {
        id: 4,
        name: 'អនុម័តការឈប់សម្រាក',
        description: 'អនុញ្ញាតឲ្យអ្នកគ្រប់គ្រងពិនិត្យ និងអនុម័តសំណើឈប់សម្រាក។',
        category: 'ការឈប់សម្រាក'
      },
      {
        id: 5,
        name: 'កែប្រែប្រវត្តិបុគ្គលិក',
        description: 'អនុញ្ញាតឲ្យកែប្រែព័ត៌មានទំនាក់ទំនង និងប្រវត្តិបុគ្គលិក។',
        category: 'ប្រវត្តិ'
      },
      {
        id: 6,
        name: 'មើលរបាយការណ៍វត្តមាន',
        description: 'បង្ហាញវត្តមាន ការយឺតយ៉ាវ និងកាលវិភាគការងារ។',
        category: 'វត្តមាន'
      }
    ]
  },
  {
    key: 'crm',
    name: 'ប្រព័ន្ធ CRM',
    roles: [
      {
        id: 7,
        name: 'អ្នកគ្រប់គ្រង CRM',
        description: 'គ្រប់គ្រងលំហូរអតិថិជន ការមើលឃើញរបស់ក្រុម និងការកំណត់ដំណើរការ។',
        permissions: ['បង្កើតអតិថិជនសក្តានុពល', 'មើលប្រវត្តិអតិថិជន']
      },
      {
        id: 8,
        name: 'អ្នកលក់',
        description: 'តាមដានអតិថិជនសក្តានុពល កែប្រែកំណត់ចំណាំ និងគ្រប់គ្រងឱកាសលក់។',
        permissions: ['បង្កើតអតិថិជនសក្តានុពល', 'កែប្រែដំណាក់កាលឱកាស']
      },
      {
        id: 9,
        name: 'ភ្នាក់ងារគាំទ្រ',
        description: 'តាមដានសំណើអតិថិជន និងធ្វើបច្ចុប្បន្នភាពកំណត់ត្រាបញ្ហា។',
        permissions: ['មើលប្រវត្តិអតិថិជន']
      }
    ],
    permissions: [
      {
        id: 7,
        name: 'បង្កើតអតិថិជនសក្តានុពល',
        description: 'បង្កើតកំណត់ត្រាអតិថិជនសក្តានុពលថ្មី និងចែកជូនក្រុម។',
        category: 'អតិថិជនសក្តានុពល'
      },
      {
        id: 8,
        name: 'កែប្រែដំណាក់កាលឱកាស',
        description: 'ធ្វើបច្ចុប្បន្នភាពដំណាក់កាលលក់ និងភាពរីកចម្រើន។',
        category: 'លំហូរលក់'
      },
      {
        id: 9,
        name: 'មើលប្រវត្តិអតិថិជន',
        description: 'អាចមើលប្រវត្តិទំនាក់ទំនង កំណត់ចំណាំ និងសកម្មភាពអតិថិជន។',
        category: 'ទិន្នន័យអតិថិជន'
      }
    ]
  },
  {
    key: 'organization',
    name: 'អង្គភាព',
    roles: [
      {
        id: 10,
        name: 'អ្នកគ្រប់គ្រងអង្គភាព',
        description: 'គ្រប់គ្រងរចនាសម្ព័ន្ធអង្គភាព តំណែង និងអ្នកកាន់តំណែង។',
        permissions: ['បន្ថែមអង្គភាព', 'កែប្រែតួនាទី']
      },
      {
        id: 11,
        name: 'អ្នកសម្របសម្រួលតួនាទី',
        description: 'តាមដានតួនាទី និងរៀបចំការចាត់តាំងអ្នកប្រើប្រាស់ក្នុងអង្គភាព។',
        permissions: ['កែប្រែតួនាទី', 'មើលរចនាសម្ព័ន្ធអង្គភាព']
      },
      {
        id: 12,
        name: 'អ្នកមើលរចនាសម្ព័ន្ធ',
        description: 'អាចមើលអង្គភាពរង តំណែង និងព័ត៌មានសង្ខេបរបស់អង្គភាព។',
        permissions: ['មើលរចនាសម្ព័ន្ធអង្គភាព']
      }
    ],
    permissions: [
      {
        id: 10,
        name: 'បន្ថែមអង្គភាព',
        description: 'អនុញ្ញាតឲ្យបង្កើតអង្គភាពថ្មី ឬអង្គភាពរងក្នុងរចនាសម្ព័ន្ធ។',
        category: 'អង្គភាព'
      },
      {
        id: 11,
        name: 'កែប្រែតួនាទី',
        description: 'អនុញ្ញាតឲ្យបន្ថែម កែប្រែ ឬចាត់តាំងតួនាទីក្នុងអង្គភាព។',
        category: 'តួនាទី'
      },
      {
        id: 12,
        name: 'មើលរចនាសម្ព័ន្ធអង្គភាព',
        description: 'អាចមើលមែកធាងអង្គភាព តំណែង និងព័ត៌មានដែលពាក់ព័ន្ធ។',
        category: 'មើលទិន្នន័យ'
      }
    ]
  }
])

const activeSystem = ref(systems.value[0].key)
const selectedPositionId = ref(32)
const selectedHolderEmail = ref('jamie.v@globalcorp.com')
const treeSearchInput = ref('')
const treeSearchKeyword = ref('')
const isNodeModalOpen = ref(false)
const nodeModalAction = ref('')
const nodeModalTargetId = ref(null)
const nodeModalName = ref('')

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

function ensureDashboardSelection() {
  const positions = getAllPositions(organizations.value)
  const currentPosition = positions.find((position) => position.id === selectedPositionId.value)
  const fallbackPosition = currentPosition || positions[0] || null

  selectedPositionId.value = fallbackPosition?.id || null
  selectedHolderEmail.value = fallbackPosition?.people?.[0]?.email || ''
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
      summary: 'តួនាទីថ្មីក្នុងអង្គភាពនេះ',
      people: []
    }

    target.positions = [...(target.positions || []), newPosition]
    selectedPositionId.value = newPosition.id
    selectedHolderEmail.value = ''
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
    ensureDashboardSelection()
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
  padding: 18px 20px;
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
  font-size: 20px;
  font-weight: 500;
  line-height: 1.1;
}

.holders-panel {
  margin-top: 8px;
}

.holders-label {
  margin: 0 0 10px;
  color: #8a9bb2;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.holders-list {
  display: grid;
  gap: 10px;
}

.holders-list--inline {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-height: none;
  overflow: visible;
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
  font-size: 13px;
  font-weight: 500;
}

.holder-copy span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  color: #8ea3c0;
  font-size: 11px;
}

.holder-id {
  display: block;
  color: #54708f;
  font-size: 12px;
  font-weight: 400;
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
