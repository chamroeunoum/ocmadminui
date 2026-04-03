<template>
  <div class="hr-page font-sr">
    <section class="hr-card">
      <p class="hr-eyebrow font-sr">ប្រព័ន្ធ HR</p>
      <h1 class="hr-title font-sr">ផ្ទាំងគ្រប់គ្រងធនធានមនុស្ស</h1>
      <p class="hr-text font-sr">
        ផ្ទាំងនេះត្រៀមសម្រាប់ការគ្រប់គ្រងបុគ្គលិក តួនាទី និងសិទ្ធិប្រើប្រាស់ដែលពាក់ព័ន្ធនឹងធនធានមនុស្ស។
      </p>

      <div class="hr-tags">
        <span class="hr-tag font-sr">បុគ្គលិក</span>
        <span class="hr-tag font-sr">តួនាទី</span>
        <span class="hr-tag font-sr">សិទ្ធិប្រើប្រាស់</span>
      </div>
    </section>
  </div>
</template>

<script setup>
</script>

<style scoped>
.hr-page,
.hr-page * {
  text-align: left;
  user-select: text;
}

.hr-page {
  padding: 24px;
}

.hr-card {
  padding: 28px;
  background: #ffffff;
  border: 1px solid #dce4ee;
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(20, 36, 66, 0.06);
}

.hr-eyebrow {
  margin: 0 0 8px;
  color: #0f9f72;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hr-title {
  margin: 0;
  color: #163153;
  font-size: 28px;
  font-weight: 600;
}

.hr-text {
  margin: 12px 0 0;
  max-width: 58ch;
  color: #62758d;
  font-size: 15px;
  line-height: 1.7;
}

.hr-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}

.hr-tag {
  padding: 8px 12px;
  color: #0f9f72;
  font-size: 13px;
  background: #e8faf3;
  border: 1px solid #c9f0df;
  border-radius: 999px;
}
</style>
