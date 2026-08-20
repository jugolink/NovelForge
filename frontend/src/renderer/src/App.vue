<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed, defineAsyncComponent } from 'vue'
import { storeToRefs } from 'pinia'
import Dashboard from './views/Dashboard.vue'
import Editor from './views/Editor.vue'
import Login from './views/Login.vue'
import Header from './components/common/Header.vue'
import SettingsDialog from './components/common/SettingsDialog.vue'
import { useAppStore } from './stores/useAppStore'
import { useProjectStore } from './stores/useProjectStore'
import { useUpdateStore } from './stores/useUpdateStore'
import { useWorkflowStore } from './stores/useWorkflowStore'
import type { components } from '@renderer/types/generated'
import { schemaService } from './api/schema'

const IdeasHome = defineAsyncComponent(() => import('./views/IdeasHome.vue'))
const CodeWorkflowEditor = defineAsyncComponent(() => import('./views/workflow/CodeWorkflowEditor.vue'))
const WorkflowStatusBar = defineAsyncComponent(() => import('./components/workflow/WorkflowStatusBar.vue'))

type Project = components['schemas']['ProjectRead']

const appStore = useAppStore()
const projectStore = useProjectStore()
const updateStore = useUpdateStore()
const workflowStore = useWorkflowStore()

const { currentView, settingsDialogVisible } = storeToRefs(appStore)
const { currentProject } = storeToRefs(projectStore)

const isAuthenticated = ref(!!localStorage.getItem('access_token'))

function handleLoginSuccess() {
  isAuthenticated.value = true
  initApp()
}

function handleProjectSelected(project: Project) {
  projectStore.setCurrentProject(project)
  appStore.goToEditor()
}

function handleBackToDashboard() {
  projectStore.reset()
  appStore.goToDashboard()
}

function handleOpenSettings() {
  appStore.openSettings()
}

function handleCloseSettings() {
  appStore.closeSettings()
}

const isNoHeader = computed(() => {
  const h = window.location.hash || ''
  return h.startsWith('#/ideas-home')
})

async function syncViewFromHash() {
  const hash = window.location.hash || ''
  if (hash.startsWith('#/ideas-home')) {
    appStore.goToIdeas()
    try { await projectStore.loadFreeProject() } catch {}
  }
  if (hash.startsWith('#/workflows')) {
    appStore.goToWorkflows()
  }
  if (hash.startsWith('#/code-workflows')) {
    appStore.goToCodeWorkflows()
  }
}

async function initApp() {
  schemaService.loadSchemas() // Load all schemas on app startup
  syncViewFromHash()
  window.addEventListener('hashchange', syncViewFromHash)
  
  // 设置工作流监听器（监听响应头中的 X-Workflows-Started）
  const cleanupWorkflowListener = workflowStore.setupWorkflowListener()
  
  // 在组件卸载时清理
  onBeforeUnmount(() => {
    cleanupWorkflowListener()
  })
  
  // 自动检测更新（如果开启）
  if (updateStore.autoCheckEnabled) {
    try {
      await updateStore.autoCheck()
    } catch (error) {
      // 静默失败，不打扰用户
      console.warn('自动检测更新失败:', error)
    }
  }
}

// 初始化主题和加载全局资源
onMounted(async () => {
  appStore.initTheme()
  if (isAuthenticated.value) {
    initApp()
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', syncViewFromHash)
})
</script>

<template>
  <div v-if="!isAuthenticated" class="app-layout">
    <Login @login-success="handleLoginSuccess" />
  </div>
  <div v-else class="app-layout">
    <Header v-if="!isNoHeader" />
    <main class="main-content">
      <transition name="fade" mode="out-in">
        <Dashboard key="dashboard" v-if="currentView === 'dashboard'" @project-selected="handleProjectSelected" />
        <Editor
          key="editor"
          v-else-if="currentView === 'editor' && currentProject"
          :initial-project="currentProject"
          @back-to-dashboard="handleBackToDashboard"
        />
        <IdeasHome key="ideas" v-else-if="currentView === 'ideas'" />
        <CodeWorkflowEditor key="workflows" v-else-if="currentView === 'workflows'" />
      </transition>
    </main>

    <SettingsDialog 
      v-model="settingsDialogVisible"
      @close="handleCloseSettings"
    />
    <WorkflowStatusBar />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: var(--el-bg-color-page);
}

.main-content {
  flex-grow: 1;
  overflow: auto; /* Allow content to scroll if needed */
}
</style>
