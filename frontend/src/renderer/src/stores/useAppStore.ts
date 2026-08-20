import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 当前视图
  const currentView = ref<'dashboard' | 'editor' | 'ideas' | 'workflows' | 'code-workflows' | 'triggers'>('dashboard')

  // 主题状态
  const isDarkMode = ref(false)

  // 设置对话框状态
  const settingsDialogVisible = ref(false)
  const settingsInitialTab = ref<string>('llm')

  // 面板个性化配置
  const defaultFontOptions = {
    uiFont: '"Lora", "Noto Serif SC", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, serif',
    editorFont: '"Lora", "Noto Serif SC", serif',
    baseFontSize: 14
  }
  const panelConfig = ref({ ...defaultFontOptions })

  // 全局加载状态
  const globalLoading = ref(false)

  // 全局错误状态
  const globalError = ref<string | null>(null)

  // Computed
  const isDashboard = computed(() => currentView.value === 'dashboard')
  const isEditor = computed(() => currentView.value === 'editor')
  const isWorkflows = computed(() => currentView.value === 'workflows')

  // Actions
  function setCurrentView(view: 'dashboard' | 'editor' | 'ideas' | 'workflows' | 'code-workflows' | 'triggers') {
    currentView.value = view
  }

  function goToDashboard() {
    currentView.value = 'dashboard'
  }

  function goToEditor() {
    currentView.value = 'editor'
  }

  function goToIdeas() {
    currentView.value = 'ideas'
  }

  function goToWorkflows() {
    currentView.value = 'workflows'
  }

  function goToCodeWorkflows() {
    currentView.value = 'code-workflows'
  }

  function goToTriggers() {
    currentView.value = 'triggers'
  }

  function toggleTheme() {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
    applyTheme()
  }

  function setTheme(dark: boolean) {
    isDarkMode.value = dark
    localStorage.setItem('theme', dark ? 'dark' : 'light')
    applyTheme()
  }

  function applyTheme() {
    const html = document.documentElement
    if (isDarkMode.value) {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }

  function applyPanelConfig() {
    localStorage.setItem('panelConfig', JSON.stringify(panelConfig.value))
    const html = document.documentElement
    html.style.setProperty('--ui-font', panelConfig.value.uiFont)
    html.style.setProperty('--editor-font', panelConfig.value.editorFont)
    html.style.setProperty('--base-font-size', `${panelConfig.value.baseFontSize}px`)
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    isDarkMode.value = savedTheme === 'dark'
    applyTheme()
    
    // 初始化面板配置
    const savedConfig = localStorage.getItem('panelConfig')
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig)
        panelConfig.value = { ...defaultFontOptions, ...parsed }
      } catch (e) {
        console.error('Failed to parse panel config', e)
      }
    }
    applyPanelConfig()
  }

  function openSettings(tab?: string) {
    if (tab) settingsInitialTab.value = tab
    settingsDialogVisible.value = true
  }

  function closeSettings() {
    settingsDialogVisible.value = false
  }

  function setGlobalLoading(loading: boolean) {
    globalLoading.value = loading
  }

  function setGlobalError(error: string | null) {
    globalError.value = error
  }

  function clearGlobalError() {
    globalError.value = null
  }

  function reset() {
    currentView.value = 'dashboard'
    settingsDialogVisible.value = false
    globalLoading.value = false
    globalError.value = null
  }

  return {
    // State
    currentView,
    isDarkMode,
    settingsDialogVisible,
    settingsInitialTab,
    globalLoading,
    globalError,
    panelConfig,

    // Computed
    isDashboard,
    isEditor,
    isWorkflows,

    // Actions
    setCurrentView,
    goToDashboard,
    goToEditor,
    goToIdeas,
    goToWorkflows,
    goToCodeWorkflows,
    goToTriggers,
    toggleTheme,
    setTheme,
    applyTheme,
    applyPanelConfig,
    initTheme,
    openSettings,
    closeSettings,
    setGlobalLoading,
    setGlobalError,
    clearGlobalError,
    reset
  }
}) 
