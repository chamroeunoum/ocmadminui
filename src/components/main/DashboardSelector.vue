<template>
  <div class="selector-page">
    <div class="selector-card">
      <p class="selector-eyebrow">Organization Management</p>
      <h1 class="selector-title">Choose A Version</h1>
      <p class="selector-description">
        Select which organization interface you want to open after login.
      </p>

      <div class="selector-actions">
        <button
          type="button"
          class="selector-button"
          @click="router.push('/dashboard/organization-v1')"
        >
          <span class="selector-button__label">Organization V1</span>
          <span class="selector-button__text">Open the current organization management screen.</span>
        </button>

        <button
          type="button"
          class="selector-button selector-button--alt"
          @click="router.push('/dashboard/organization-v1-1')"
        >
          <span class="selector-button__label">Organization V1.1</span>
          <span class="selector-button__text">Open the alternative organization management version.</span>
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
  padding: 24px;
}

.selector-card {
  width: min(720px, 100%);
  padding: 28px;
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
  gap: 16px;
  margin-top: 24px;
}

.selector-button {
  display: grid;
  gap: 8px;
  padding: 20px;
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
  font-size: 18px;
  font-weight: 800;
}

.selector-button__text {
  color: #5f7289;
  font-size: 14px;
  line-height: 1.6;
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
}
</style>
