<template>
  <div class="app-container">
    <login-page />
    
    <div class="usage-instructions">
      <n-card title="Usage Instructions" size="small">
        <n-space vertical>
          <n-text>
            This login component uses Naive UI and is designed for the Office of the Councils of Ministers HR System.
          </n-text>
          
          <n-collapse>
            <n-collapse-item title="Installation & Setup" name="1">
              <n-space vertical>
                <n-text code>npm install naive-ui @vicons/ionicons5</n-text>
                <n-text>or</n-text>
                <n-text code>yarn add naive-ui @vicons/ionicons5</n-text>
              </n-space>
            </n-collapse-item>
            
            <n-collapse-item title="Import in your Vue app" name="2">
              <n-code language="javascript" :code="importCode" />
            </n-collapse-item>
            
            <n-collapse-item title="Main App Setup" name="3">
              <n-code language="javascript" :code="appCode" />
            </n-collapse-item>
            
            <n-collapse-item title="Features" name="4">
              <n-list>
                <n-list-item>
                  <n-text strong>Form Validation:</n-text> Built-in validation for username and password
                </n-list-item>
                <n-list-item>
                  <n-text strong>SSO Integration:</n-text> Ready for Single Sign-On implementation
                </n-list-item>
                <n-list-item>
                  <n-text strong>Responsive Design:</n-text> Works on all screen sizes
                </n-list-item>
                <n-list-item>
                  <n-text strong>Loading States:</n-text> Visual feedback during authentication
                </n-list-item>
                <n-list-item>
                  <n-text strong>Accessibility:</n-text> Proper ARIA labels and keyboard navigation
                </n-list-item>
              </n-list>
            </n-collapse-item>
          </n-collapse>
        </n-space>
      </n-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NSpace, NText, NCollapse, NCollapseItem, NCode, NList, NListItem } from 'naive-ui'
import LoginPage from './LoginPage.vue'

const importCode = ref(`// In your main.js or main.ts
import { createApp } from 'vue'
import App from './App.vue'
import naive from 'naive-ui'

const app = createApp(App)
app.use(naive)
app.mount('#app')`)

const appCode = ref(`// In your App.vue or main component
<template>
  <div id="app">
    <LoginPage />
  </div>
</template>

<script setup>
import LoginPage from './components/LoginPage.vue'
<\/script>`)
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 20px;
  background: #f5f5f5;
}

.usage-instructions {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.n-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.n-code {
  border-radius: 6px;
  margin: 8px 0;
}
</style>