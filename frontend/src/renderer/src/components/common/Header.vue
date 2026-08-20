<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Setting, Sunny, Moon, Document } from '@element-plus/icons-vue'
import { useAppStore } from '@renderer/stores/useAppStore'
import { useProjectStore } from '@renderer/stores/useProjectStore'
import { useUpdateStore } from '@renderer/stores/useUpdateStore'
import KnowledgeManager from '../setting/KnowledgeManager.vue'

const appStore = useAppStore()
const projectStore = useProjectStore()
const updateStore = useUpdateStore()
const { currentView, isDarkMode } = storeToRefs(appStore)

function toggleTheme() {
  appStore.toggleTheme()
}

function openSettingsDialog() {
  appStore.openSettings()
}

function openWorkflowManager() {
  appStore.goToWorkflows()
  window.location.hash = '#/workflows'
}

function handleLogoClick() {
  if (currentView.value !== 'dashboard') {
    appStore.goToDashboard()
  }
}

const isLogoClickable = computed(() => currentView.value !== 'dashboard')

function openIdeasWorkbench() {
  appStore.goToIdeas()
  window.location.hash = '#/ideas-home'
}

// 知识库抽屉
// const kbVisible = ref(false)
</script>

<template>
  <header class="app-header">
    <div class="logo-container" @click="handleLogoClick" :class="{ clickable: isLogoClickable }">
      <span class="logo-text">Novel Forge</span>
    </div>
    <div class="actions-container">
      <el-button type="primary" title="灵感工作台" @click="openIdeasWorkbench">
        <el-icon><Document /></el-icon>
        <span style="margin-left:6px;">灵感</span>
      </el-button>
      <el-button type="primary" plain title="工作流" @click="openWorkflowManager">工作流</el-button>
      <el-button :icon="isDarkMode ? Moon : Sunny" @click="toggleTheme" circle title="切换主题" />
      <el-badge :is-dot="updateStore.hasUpdate" type="warning">
        <el-button :icon="Setting" @click="openSettingsDialog" circle title="设置" />
      </el-badge>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  height: 56px;
  width: 100%;
  background: var(--bg-color-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  flex-shrink: 0;
  position: relative;
  z-index: 100;
  transition: all 0.3s ease;
}

.logo-container.clickable {
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.logo-container.clickable:hover {
  transform: scale(1.05);
}

.logo-container .logo-text {
  font-size: 20px;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
}

.actions-container {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style> 