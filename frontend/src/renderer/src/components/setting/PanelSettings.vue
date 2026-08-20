<script setup lang="ts">
import { useAppStore } from '@renderer/stores/useAppStore'

const appStore = useAppStore()

const fontOptions = [
  { label: '系统默认 (System)', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' },
  { label: 'Inter (无衬线科技感)', value: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' },
  { label: 'Lora / Noto Serif (衬线文艺感)', value: '"Lora", "Noto Serif SC", serif' },
  { label: '霞鹜文楷 (LXGW WenKai)', value: '"LXGW WenKai", "LXGW WenKai Screen", serif' },
  { label: '微软雅黑 (Microsoft YaHei)', value: '"Microsoft YaHei", "PingFang SC", sans-serif' }
]
</script>

<template>
  <div class="panel-settings">
    <div class="settings-header">
      <h3>面板个性化配置</h3>
      <p class="subtitle">调整整个应用的外观细节与排版风格，所有设置将自动保存并立即生效。</p>
    </div>

    <el-form label-position="top" class="settings-form">
      <el-form-item label="全局界面字体 (UI Font)">
        <template #label>
          <div class="form-label-with-desc">
            <span>全局界面字体 (UI Font)</span>
            <span class="label-desc">控制导航栏、按钮、面板弹窗等区域的显示字体。</span>
          </div>
        </template>
        <el-select v-model="appStore.panelConfig.uiFont" placeholder="请选择字体" style="width: 100%" @change="appStore.applyPanelConfig">
          <el-option
            v-for="font in fontOptions"
            :key="font.value"
            :label="font.label"
            :value="font.value"
          >
            <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="编辑器正文字体 (Editor Font)">
        <template #label>
          <div class="form-label-with-desc">
            <span>编辑器正文字体 (Editor Font)</span>
            <span class="label-desc">专门控制创作区卡片正文、小说正文的字体，推荐使用衬线体。</span>
          </div>
        </template>
        <el-select v-model="appStore.panelConfig.editorFont" placeholder="请选择字体" style="width: 100%" @change="appStore.applyPanelConfig">
          <el-option
            v-for="font in fontOptions"
            :key="font.value"
            :label="font.label"
            :value="font.value"
          >
            <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="基础字号微调 (Base Font Size)">
        <template #label>
          <div class="form-label-with-desc">
            <span>基础字号微调 (Base Font Size)</span>
            <span class="label-desc">调整整个应用的基础字体大小。</span>
          </div>
        </template>
        <div class="slider-container">
          <el-slider
            v-model="appStore.panelConfig.baseFontSize"
            :min="12"
            :max="20"
            :step="1"
            show-input
            @change="appStore.applyPanelConfig"
          />
          <span class="slider-unit">px</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.panel-settings {
  padding: 8px 16px;
}
.settings-header {
  margin-bottom: 24px;
}
.settings-header h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: var(--el-text-color-primary);
}
.subtitle {
  margin: 0;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.settings-form {
  max-width: 600px;
}
.form-label-with-desc {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}
.label-desc {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: normal;
  margin-top: 2px;
}
.slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
}
.slider-container :deep(.el-slider) {
  flex: 1;
}
.slider-unit {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
