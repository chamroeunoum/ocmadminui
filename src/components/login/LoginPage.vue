<template>
  <div class="login-container">
    <n-card class="login-card" :bordered="false">
      <template #header>
        <div class="login-header">
          <n-gradient-text type="primary" size="24">
            Office of the Councils of Ministers
          </n-gradient-text>
          <n-text depth="3" class="subtitle">
            Human Resources System
          </n-text>
        </div>
      </template>

      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        size="large"
        @submit.prevent="handleSubmit"
      >
        <n-form-item path="username" label="Username">
          <n-input
            v-model:value="formValue.username"
            placeholder="Enter your username"
            :input-props="{ autocomplete: 'username' }"
          >
            <template #prefix>
              <n-icon :component="PersonOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" label="Password">
          <n-input
            v-model:value="formValue.password"
            type="password"
            placeholder="Enter your password"
            :input-props="{ autocomplete: 'current-password' }"
            show-password-on="click"
          >
            <template #prefix>
              <n-icon :component="LockClosedOutline" />
            </template>
          </n-input>
        </n-form-item>

        <n-form-item>
          <n-checkbox v-model:checked="formValue.rememberMe">
            Remember me
          </n-checkbox>
          <n-button text type="primary" class="forgot-password">
            Forgot password?
          </n-button>
        </n-form-item>

        <n-form-item>
          <n-button
            type="primary"
            attr-type="submit"
            :loading="loading"
            :block="true"
            size="large"
          >
            Sign In
          </n-button>
        </n-form-item>
      </n-form>

      <n-divider>Or continue with</n-divider>

      <div class="social-login">
        <n-button
          type="default"
          :block="true"
          size="large"
          @click="handleSSO"
          class="sso-button"
        >
          <template #icon>
            <n-icon :component="KeyOutline" />
          </template>
          Single Sign-On (SSO)
        </n-button>
      </div>

      <template #footer>
        <div class="login-footer">
          <n-text depth="3">
            © 2024 Office of the Councils of Ministers. All rights reserved.
          </n-text>
          <n-button text type="primary" size="small">
            Privacy Policy
          </n-button>
          <n-button text type="primary" size="small">
            Terms of Service
          </n-button>
        </div>
      </template>
    </n-card>

    <div class="login-background">
      <div class="background-pattern"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NCheckbox,
  NDivider,
  NText,
  NGradientText,
  NIcon,
  useMessage,
  useLoadingBar
} from 'naive-ui'
import {
  PersonOutline,
  LockClosedOutline,
  KeyOutline
} from '@vicons/ionicons5'

const message = useMessage()
const loadingBar = useLoadingBar()
const formRef = ref(null)
const loading = ref(false)

const formValue = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const rules = {
  username: [
    {
      required: true,
      message: 'Please enter your username',
      trigger: ['input', 'blur']
    },
    {
      min: 3,
      message: 'Username must be at least 3 characters',
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: 'Please enter your password',
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      message: 'Password must be at least 6 characters',
      trigger: ['input', 'blur']
    }
  ]
}

const handleSubmit = (e) => {
  e.preventDefault()
  
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('Please fix the errors in the form')
      return
    }

    loading.value = true
    loadingBar.start()

    // Simulate API call
    setTimeout(() => {
      loading.value = false
      loadingBar.finish()
      
      message.success(`Welcome back, ${formValue.username}!`)
      
      // In a real app, you would:
      // 1. Call authentication API
      // 2. Store token
      // 3. Redirect to dashboard
      console.log('Login attempt:', {
        username: formValue.username,
        rememberMe: formValue.rememberMe
      })
    }, 1500)
  })
}

const handleSSO = () => {
  loadingBar.start()
  message.info('Redirecting to SSO provider...')
  
  setTimeout(() => {
    loadingBar.finish()
    // In a real app, redirect to SSO endpoint
    console.log('SSO login initiated')
  }, 1000)
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  z-index: 1;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.95);
}

.login-header {
  text-align: center;
  margin-bottom: 8px;
}

.subtitle {
  display: block;
  margin-top: 8px;
  font-size: 14px;
}

.forgot-password {
  margin-left: auto;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sso-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.sso-button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.background-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -20px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 30px) rotate(240deg);
  }
}

:deep(.n-input) {
  border-radius: 8px;
}

:deep(.n-button) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.n-button--primary-type) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

:deep(.n-button--primary-type:hover) {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

:deep(.n-card__content) {
  padding-top: 8px;
}
</style>