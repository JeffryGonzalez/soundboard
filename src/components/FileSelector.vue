<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isFileSystemSupported: boolean
  isLoading: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  addFiles: []
  addDirectory: []
  clearAll: []
}>()

const showClearConfirm = ref(false)

const confirmClear = () => {
  showClearConfirm.value = true
}

const cancelClear = () => {
  showClearConfirm.value = false
}

const executeClear = () => {
  emit('clearAll')
  showClearConfirm.value = false
}
</script>

<template>
  <div class="file-selector">
    <div v-if="!isFileSystemSupported" class="warning-banner">
      <span class="warning-icon">⚠️</span>
      <div>
        <strong>File System Access API not supported</strong>
        <p>
          This browser doesn't support the File System Access API. Please use Chrome, Edge, or
          another supported browser.
        </p>
      </div>
    </div>

    <div class="button-group">
      <button
        @click="emit('addFiles')"
        :disabled="!isFileSystemSupported || isLoading"
        class="primary-btn"
      >
        <span class="btn-icon">📁</span>
        Add Files
      </button>

      <button
        @click="emit('addDirectory')"
        :disabled="!isFileSystemSupported || isLoading"
        class="primary-btn"
      >
        <span class="btn-icon">📂</span>
        Add Folder
      </button>

      <button @click="confirmClear" :disabled="isLoading" class="danger-btn">
        <span class="btn-icon">🗑️</span>
        Clear All
      </button>
    </div>

    <div v-if="isLoading" class="loading-indicator">
      <span class="spinner"></span>
      Loading files...
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showClearConfirm" class="modal-overlay" @click="cancelClear">
      <div class="modal-content" @click.stop>
        <h3>Clear All Sounds?</h3>
        <p>
          This will remove all sound buttons from your soundboard. This action cannot be undone.
        </p>
        <div class="modal-buttons">
          <button @click="cancelClear" class="secondary-btn">Cancel</button>
          <button @click="executeClear" class="danger-btn">Clear All</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-selector {
  padding: 20px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.warning-banner {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 20px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  color: #856404;
}

.warning-icon {
  font-size: 24px;
  line-height: 1;
}

.warning-banner strong {
  display: block;
  margin-bottom: 4px;
}

.warning-banner p {
  margin: 0;
  font-size: 14px;
}

.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.primary-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.primary-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.secondary-btn {
  background: #e0e0e0;
  color: #333;
}

.secondary-btn:hover {
  background: #d0d0d0;
}

.danger-btn {
  background: #dc3545;
  color: white;
}

.danger-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 18px;
  line-height: 1;
}

.loading-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  color: #666;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-content h3 {
  margin: 0 0 16px 0;
  color: #333;
}

.modal-content p {
  margin: 0 0 24px 0;
  color: #666;
  line-height: 1.5;
}

.modal-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .button-group {
    flex-direction: column;
  }

  .primary-btn,
  .secondary-btn,
  .danger-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
