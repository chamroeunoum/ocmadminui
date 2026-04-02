<template>
  <div class="hr-dashboard font-sr">
    <div class="dashboard-layout">
      <aside class="left-column">
        <section class="panel-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow font-moul">ប្រព័ន្ធ HR</p>
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
                ជ្រើសរើសអង្គភាពមួយ ដើម្បីមើលបញ្ជីមន្ត្រី និងប្តូររបៀបបង្ហាញជាកាត ឬតារាង។
              </p>
            </div>

            <span class="panel-badge font-sr">{{ totalOrganizations }} អង្គភាព</span>
          </div>

          <div class="tree-scroll">
            <OrganizationOnlyTree
              :organizations="filteredOrganizations"
              :selected-org-id="selectedOrganization.id"
              @select-organization="handleOrganizationSelect"
            />
          </div>
        </section>
      </aside>

      <section class="right-column">
        <section class="hero-card">
          <div class="hero-top">
            <div>
              <p class="eyebrow font-moul">អង្គភាពដែលបានជ្រើស</p>
              <h1 class="hero-title font-moul">{{ selectedOrganization.name }}</h1>
              <p class="section-description font-sr">
                បញ្ជីមន្ត្រីក្នុងអង្គភាពនេះអាចបង្ហាញជាកាត ឬជាតារាង ដើម្បីសាកល្បងទិន្នន័យ mock បានងាយ។
              </p>
            </div>

            <div class="view-switch">
              <button
                type="button"
                class="view-button font-sr"
                :class="{ active: viewMode === 'card' }"
                @click="viewMode = 'card'"
              >
                កាត
              </button>
              <button
                type="button"
                class="view-button font-sr"
                :class="{ active: viewMode === 'table' }"
                @click="viewMode = 'table'"
              >
                តារាង
              </button>
            </div>
          </div>

          <div class="hero-meta">
            <span class="meta-pill font-sr">{{ selectedOrganization.officers.length }} មន្ត្រី</span>
            <span class="meta-pill font-sr">បង្ហាញ {{ viewMode === 'card' ? 'ជាកាត' : 'ជាតារាង' }}</span>
          </div>
        </section>

        <section v-if="viewMode === 'card'" class="officer-grid">
          <article
            v-for="officer in selectedOrganization.officers"
            :key="officer.id"
            class="officer-card"
          >
            <div class="officer-card__head">
              <div class="officer-avatar">
                <span class="officer-avatar__inner font-sr">{{ officer.initials }}</span>
              </div>

              <div class="officer-copy">
                <h3 class="officer-name font-sr">{{ officer.nameKh }}</h3>
                <p class="officer-id font-sr">{{ officer.id }}</p>
              </div>
            </div>

            <div class="officer-meta-list">
              <div class="officer-meta-item">
                <span class="info-label font-sr">លេខអត្តសញ្ញាណ</span>
                <strong class="font-sr">{{ officer.nationalId }}</strong>
              </div>
              <div class="officer-meta-item">
                <span class="info-label font-sr">ថ្ងៃខែចូលបម្រើ</span>
                <strong class="font-sr">{{ officer.officialDate }}</strong>
              </div>
              <div class="officer-meta-item">
                <span class="info-label font-sr">អង្គភាព</span>
                <strong class="font-sr">{{ selectedOrganization.name }}</strong>
              </div>
            </div>
          </article>
        </section>

        <section v-else class="table-card">
          <table class="officer-table">
            <thead>
              <tr>
                <th class="font-sr">ល.រ</th>
                <th class="font-sr">ឈ្មោះ</th>
                <th class="font-sr">អត្តលេខ</th>
                <th class="font-sr">អង្គភាព</th>
                <th class="font-sr">តួនាទី</th>
                <th class="font-sr">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="officer in selectedOrganization.officers"
                :key="`table-${officer.id}`"
              >
                <td class="font-sr">{{ officer.rank }}</td>
                <td class="font-sr">
                  <div class="table-person">
                    <span class="table-avatar">{{ officer.initials }}</span>
                    <div>
                      <strong class="font-sr">{{ officer.nameKh }}</strong>
                      <span class="font-sr">{{ officer.nameEn }}</span>
                    </div>
                  </div>
                </td>
                <td class="font-sr">{{ officer.id }}</td>
                <td class="font-sr">{{ selectedOrganization.name }}</td>
                <td class="font-sr">{{ officer.position }}</td>
                <td>
                  <span class="table-status font-sr">សកម្ម</span>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>
    </div>
  </div>
</template>

<script setup>
import { Search02Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/vue'
import { computed, ref } from 'vue'
import OrganizationOnlyTree from '@/components/Organization_V1.1/OrganizationOnlyTree.vue'

function createOfficers(organizationName, prefix) {
  return [
    { id: `${prefix}-001`, rank: 1, initials: 'LS', roleKh: 'លោក', nameKh: 'លេង សុធី', nameEn: 'Leng Sothy', nationalId: '០៩១៣៨៨៥៤០', officialDate: '០៤-០៩-២០២១', position: 'នាយករងផែនការស្ថិតិ' },
    { id: `${prefix}-002`, rank: 2, initials: 'NC', roleKh: 'ឯកឧត្តម', nameKh: 'នូ ចាន់ដេត', nameEn: 'Nou Channdeth', nationalId: '០៨១៩៥៩៣៣៣', officialDate: '០៣-១២-២០២៥', position: 'ប្រធានការិយាល័យ' },
    { id: `${prefix}-003`, rank: 3, initials: 'SP', roleKh: 'លោកស្រី', nameKh: 'សុខ ពិសី', nameEn: 'Sok Pisey', nationalId: '០៩០៨៨៧៧៧១', officialDate: '១៥-០៣-២០២០', position: 'អនុប្រធានផ្នែក' },
    { id: `${prefix}-004`, rank: 4, initials: 'DM', roleKh: 'លោក', nameKh: 'ដារា ម៉េង', nameEn: 'Dara Meng', nationalId: '០៧៨២២១១៤៤', officialDate: '២១-០៨-២០១៩', position: 'មន្ត្រីសម្របសម្រួល' },
    { id: `${prefix}-005`, rank: 5, initials: 'RL', roleKh: 'លោកស្រី', nameKh: 'រស្មី លីណា', nameEn: 'Rasmey Lina', nationalId: '០៩២៣១០៨៨៤', officialDate: '០៧-១១-២០២២', position: 'មន្ត្រីរដ្ឋបាល' },
    { id: `${prefix}-006`, rank: 6, initials: 'VT', roleKh: 'លោក', nameKh: 'វិទូ តារា', nameEn: 'Vitou Tara', nationalId: '០៨៩៤៤៤៨៨៥', officialDate: '១២-០១-២០១៨', position: 'មន្ត្រីគ្រប់គ្រងឯកសារ' },
    { id: `${prefix}-007`, rank: 7, initials: 'KK', roleKh: 'លោកស្រី', nameKh: 'កែម កល្យាណ', nameEn: 'Kem Kalyan', nationalId: '០៩៨២២២៩៩៧', officialDate: '០២-០៥-២០២៣', position: 'មន្ត្រីធនធានមនុស្ស' },
    { id: `${prefix}-008`, rank: 8, initials: 'PM', roleKh: 'លោក', nameKh: 'ភក្ត្រា មុនី', nameEn: 'Pheaktra Mony', nationalId: '០៦៦៧៧០៤៤២', officialDate: '១៨-១០-២០២១', position: 'មន្ត្រីស្ថិតិ' },
    { id: `${prefix}-009`, rank: 9, initials: 'SN', roleKh: 'លោក', nameKh: 'សាម នារិន', nameEn: 'Sam Narin', nationalId: '០៧៧៥៥០៤១១', officialDate: '២៥-០៦-២០២០', position: 'មន្ត្រីពិនិត្យទិន្នន័យ' },
    { id: `${prefix}-010`, rank: 10, initials: 'CT', roleKh: 'លោកស្រី', nameKh: 'ចន្ទ្រា ទេពី', nameEn: 'Chantra Tepy', nationalId: '០៩៣៦៦៦៧០៥', officialDate: '០១-០២-២០២៤', position: 'មន្ត្រីទំនាក់ទំនង' }
  ].map((officer) => ({
    ...officer,
    organization: organizationName
  }))
}

const organizations = ref([
  {
    id: 1,
    name: 'អគ្គនាយកដ្ឋានរដ្ឋបាលកណ្តាល',
    expanded: true,
    officers: createOfficers('អគ្គនាយកដ្ឋានរដ្ឋបាលកណ្តាល', 'HR-A'),
    children: [
      {
        id: 2,
        name: 'នាយកដ្ឋានធនធានមនុស្ស',
        expanded: true,
        officers: createOfficers('នាយកដ្ឋានធនធានមនុស្ស', 'HR-B'),
        children: []
      },
      {
        id: 3,
        name: 'នាយកដ្ឋានបណ្តុះបណ្តាល',
        expanded: false,
        officers: createOfficers('នាយកដ្ឋានបណ្តុះបណ្តាល', 'HR-C'),
        children: []
      }
    ]
  },
  {
    id: 4,
    name: 'អគ្គនាយកដ្ឋានគោលនយោបាយ',
    expanded: false,
    officers: createOfficers('អគ្គនាយកដ្ឋានគោលនយោបាយ', 'HR-D'),
    children: [
      {
        id: 5,
        name: 'នាយកដ្ឋានស្រាវជ្រាវ',
        expanded: false,
        officers: createOfficers('នាយកដ្ឋានស្រាវជ្រាវ', 'HR-E'),
        children: []
      }
    ]
  }
])

const selectedOrganizationId = ref(1)
const treeSearchInput = ref('')
const treeSearchKeyword = ref('')
const viewMode = ref('card')

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

  const lowerKeyword = keyword.toLowerCase()

  return items.reduce((result, item) => {
    const matches = item.name.toLowerCase().includes(lowerKeyword)
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

const filteredOrganizations = computed(() => filterOrganizations(organizations.value, treeSearchKeyword.value))
const allOrganizations = computed(() => getAllOrganizations(organizations.value))

const selectedOrganization = computed(() => {
  return allOrganizations.value.find((item) => item.id === selectedOrganizationId.value) || allOrganizations.value[0]
})

const totalOrganizations = computed(() => allOrganizations.value.length)

function applyTreeSearch() {
  treeSearchKeyword.value = treeSearchInput.value
}

function handleOrganizationSelect(organization) {
  selectedOrganizationId.value = organization.id
}
</script>

<style scoped>
.hr-dashboard,
.hr-dashboard * {
  text-align: left;
  user-select: text;
}

.hr-dashboard {
  min-height: 100%;
  padding: 24px;
  background: #f5f8fc;
}

.dashboard-layout {
  display: flex;
  gap: 20px;
  align-items: stretch;
  min-height: calc(100vh - 48px);
}

.left-column {
  flex: 0 0 30%;
  min-width: 320px;
  align-self: stretch;
}

.right-column {
  flex: 1;
  min-width: 0;
  display: grid;
  grid-template-rows: auto 1fr;
  min-height: calc(100vh - 48px);
  gap: 18px;
}

.panel-card,
.hero-card,
.table-card {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(20, 36, 66, 0.06);
}

.panel-card {
  min-height: calc(100vh - 48px);
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  margin-bottom: 14px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #315bd7;
  font-size: 12px;
  letter-spacing: 0.08em;
}

.panel-title,
.hero-title {
  margin: 0;
  color: #102846;
  font-size: 24px;
  font-weight: 500;
}

.section-description {
  margin: 12px 0 0;
  max-width: 56ch;
  color: #6a7c92;
  font-size: 13px;
  line-height: 1.65;
}

.panel-badge,
.meta-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  color: #5f738d;
  font-size: 12px;
  background: #f6f8fb;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  white-space: nowrap;
}

.tree-search {
  display: flex;
  gap: 10px;
  margin-top: 14px;
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
  color: #7a8ca4;
}

.tree-search-button {
  min-width: 92px;
  padding: 0 16px;
  color: #ffffff;
  font-size: 13px;
  background: linear-gradient(180deg, #3d63f6 0%, #2d52d9 100%);
  border: none;
  border-radius: 14px;
}

.tree-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding-right: 6px;
}

.hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.view-switch {
  display: inline-flex;
  padding: 4px;
  background: #eef3f8;
  border: 1px solid #dde5ef;
  border-radius: 16px;
  gap: 4px;
}

.view-button {
  min-width: 84px;
  padding: 10px 16px;
  color: #61758f;
  font-size: 14px;
  background: transparent;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}

.view-button.active {
  color: #1f4bcc;
  background: #ffffff;
  box-shadow: 0 8px 18px rgba(31, 52, 89, 0.08);
}

.hero-meta {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.officer-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: start;
  gap: 14px;
  min-height: 0;
  height: 100%;
  overflow: auto;
  padding: 14px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 24px;
  box-shadow: 0 18px 40px rgba(20, 36, 66, 0.06);
}

.officer-card {
  display: grid;
  gap: 14px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 18px;
  box-shadow: 0 10px 22px rgba(20, 36, 66, 0.05);
}

.officer-card__head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.officer-avatar {
  width: 72px;
  height: 72px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #ffffff 0%, #f5f9ff 100%);
  border: 3px solid #dbeafc;
  border-radius: 999px;
  flex-shrink: 0;
}

.officer-avatar__inner {
  width: 48px;
  height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #b18418;
  font-size: 16px;
  font-weight: 600;
  background: radial-gradient(circle at top, #fff7d6 0%, #f7ddb1 100%);
  border-radius: 999px;
}

.officer-name {
  margin: 0;
  color: #1b2a44;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.45;
}

.officer-id {
  margin: 4px 0 0;
  color: #7285a0;
  font-size: 12px;
}

.officer-copy {
  min-width: 0;
}

.officer-meta-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
}

.officer-meta-item {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  background: #f8fbff;
  border: 1px solid #dfe7f2;
  border-radius: 14px;
}

.info-label {
  color: #6f82a0;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.officer-meta-item strong {
  color: #182945;
  font-size: 14px;
  font-weight: 500;
}

.table-card {
  overflow: auto;
  padding: 10px 14px 14px;
  height: 100%;
  min-height: 0;
}

.officer-table {
  width: 100%;
  border-collapse: collapse;
}

.officer-table th,
.officer-table td {
  padding: 12px 10px;
  border-bottom: 1px solid #e4ebf3;
  vertical-align: middle;
}

.officer-table th {
  color: #6d809a;
  font-size: 12px;
  font-weight: 500;
  background: #f8fbff;
  text-align: left;
}

.officer-table td {
  color: #18304f;
  font-size: 13px;
}

.table-person {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-person strong,
.table-person span {
  display: block;
}

.table-person strong {
  color: #173156;
  font-size: 13px;
  font-weight: 500;
}

.table-person span {
  margin-top: 4px;
  color: #7285a0;
  font-size: 11px;
}

.table-avatar {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #8b6a17;
  font-size: 13px;
  background: #fff1c7;
  border-radius: 999px;
  flex-shrink: 0;
}

.table-status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  color: #166534;
  font-size: 12px;
  background: #bbf7d0;
  border: 1px solid #4ade80;
  border-radius: 999px;
}

@media (max-width: 1100px) {
  .dashboard-layout {
    flex-direction: column;
  }

  .left-column {
    width: 100%;
    min-width: 0;
  }

  .panel-card {
    min-height: auto;
    height: auto;
  }

  .right-column {
    min-height: auto;
  }

  .tree-scroll {
    max-height: none;
    overflow: visible;
  }

  .officer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .hr-dashboard {
    padding: 16px;
  }

  .hero-top,
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .tree-search {
    flex-direction: column;
  }

  .officer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
