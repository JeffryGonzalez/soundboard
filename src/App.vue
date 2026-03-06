<script setup lang="ts">
import FileSelector from './components/FileSelector.vue'
import SoundboardGrid from './components/SoundboardGrid.vue'
import { useSoundboard } from './composables/useSoundboard'
import type { SoundButton } from './composables/useIndexedDB'

const soundboard = useSoundboard()

const handlePlay = async (button: SoundButton) => {
  await soundboard.toggleSound(button)
}

const handleToggleLoop = async (buttonId: string) => {
  await soundboard.toggleLoop(buttonId)
}

const handleRemove = async (buttonId: string) => {
  await soundboard.removeButton(buttonId)
}
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="header-content">
        <h1>🎵 Soundboard PWA</h1>
        <p class="subtitle">Play audio files from your local file system</p>
      </div>
    </header>

    <FileSelector
      :is-file-system-supported="soundboard.isFileSystemSupported.value"
      :is-loading="soundboard.isLoading.value"
      @add-files="soundboard.addFiles"
      @add-directory="soundboard.addDirectory"
      @clear-all="soundboard.clearAll"
    />

    <div v-if="soundboard.error.value" class="error-banner">
      <span class="error-icon">⚠️</span>
      <span>{{ soundboard.error.value }}</span>
      <button @click="soundboard.error.value = null" class="close-btn">✕</button>
    </div>

    <main class="app-main">
      <SoundboardGrid
        :buttons="soundboard.buttons.value"
        :get-player-state="soundboard.getButtonState"
        @play="handlePlay"
        @toggle-loop="handleToggleLoop"
        @remove="handleRemove"
      />
    </main>

    <footer class="app-footer">
      <p>
        Powered by
        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API"
          target="_blank"
          >File System Access API</a
        >
        &amp;
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" target="_blank"
          >Web Audio API</a
        >
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f8f9fa, #e9ecef);
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 32px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
}

.subtitle {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8d7da;
  border-bottom: 2px solid #dc3545;
  color: #721c24;
}

.error-icon {
  font-size: 20px;
}

.error-banner span {
  flex: 1;
}

.close-btn {
  background: none;
  border: none;
  color: #721c24;
  font-size: 20px;
  cursor: pointer;
  padding: 0 8px;
  line-height: 1;
}

.close-btn:hover {
  opacity: 0.7;
}

.app-main {
  flex: 1;
  overflow-y: auto;
}

.app-footer {
  padding: 20px;
  text-align: center;
  background: white;
  border-top: 1px solid #e0e0e0;
  color: #666;
  font-size: 14px;
}

.app-footer a {
  color: #667eea;
  text-decoration: none;
}

.app-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 14px;
  }
}
</style>
