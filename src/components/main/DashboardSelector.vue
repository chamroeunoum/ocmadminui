<template>
  <div class="selector-page font-sr">
    <div class="selector-card">
      <p class="selector-eyebrow font-moul">ការគ្រប់គ្រងអង្គភាព</p>
      <h1 class="selector-title font-moul">ជ្រើសរើសកំណែប្រើប្រាស់</h1>
      <p class="selector-description font-sr">
        ជ្រើសរើសទម្រង់អង្គភាពដែលអ្នកចង់បើកបន្ទាប់ពីចូលប្រព័ន្ធរួច។
      </p>

      <div class="selector-actions">
        <button
          type="button"
          class="selector-button"
          @click="router.push('/dashboard/organization-v1')"
        >
          <span class="selector-button__label font-moul">ការគ្រប់គ្រងអង្គភាព V1</span>
          <span class="selector-button__text font-sr">បើកផ្ទាំងគ្រប់គ្រងអង្គភាពកំណែបច្ចុប្បន្ន។</span>
        </button>

        <button
          type="button"
          class="selector-button selector-button--alt"
          @click="router.push('/dashboard/organization-v1-1')"
        >
          <span class="selector-button__label font-moul">ការគ្រប់គ្រងអង្គភាព V1.1</span>
          <span class="selector-button__text font-sr">បើកផ្ទាំងគ្រប់គ្រងអង្គភាពកំណែថ្មី។</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.selector-page,
.selector-page * {
  text-align: left;
  user-select: text;
}

.selector-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
}

.selector-card {
  width: min(860px, 100%);
  padding: 32px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(20, 36, 66, 0.07);
}

.selector-eyebrow {
  margin: 0 0 8px;
  color: #2753c7;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.selector-title {
  margin: 0;
  color: #163153;
  font-size: 32px;
  font-weight: 800;
}

.selector-description {
  margin: 12px 0 0;
  color: #66788f;
  font-size: 15px;
  line-height: 1.7;
}

.selector-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 28px;
}

.selector-button {
  display: grid;
  gap: 10px;
  min-height: 150px;
  padding: 24px;
  text-align: left;
  background: linear-gradient(180deg, #eff4ff 0%, #e6eeff 100%);
  border: 1px solid #cfdcff;
  border-radius: 18px;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.selector-button:hover {
  transform: translateY(-1px);
  border-color: #b7c9f5;
  box-shadow: 0 10px 22px rgba(39, 83, 199, 0.12);
}

.selector-button--alt {
  background: linear-gradient(180deg, #f5f9ff 0%, #edf4ff 100%);
}

.selector-button__label {
  color: #163153;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.35;
}

.selector-button__text {
  color: #5f7289;
  font-size: 14px;
  line-height: 1.6;
  max-width: 34ch;
}

@media (max-width: 720px) {
  .selector-actions {
    grid-template-columns: 1fr;
  }

  .selector-card {
    padding: 22px;
  }

  .selector-title {
    font-size: 26px;
  }

  .selector-button {
    min-height: auto;
    padding: 20px;
  }
}
</style>
