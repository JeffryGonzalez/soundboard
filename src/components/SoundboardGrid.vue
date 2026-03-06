<script setup lang="ts">
import { type Ref, ref } from 'vue'
import SoundButton from './SoundButton.vue'
import type { SoundButton as SoundButtonType } from '@/composables/useIndexedDB'

interface Props {
  buttons: SoundButtonType[]
  getPlayerState: (
    buttonId: string,
  ) => Ref<{ isPlaying: boolean; currentTime: number; duration: number }>
}

defineProps<Props>()

const emit = defineEmits<{
  play: [button: SoundButtonType]
  toggleLoop: [buttonId: string]
  remove: [buttonId: string]
  reorder: [fromIndex: number, toIndex: number]
}>()

// Drag and drop state
const draggedIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const handleDragStart = (index: number) => {
  draggedIndex.value = index
}

const handleDragEnter = (index: number) => {
  if (draggedIndex.value !== null && draggedIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault() // Required to allow drop
}

const handleDrop = (event: DragEvent, toIndex: number) => {
  event.preventDefault()

  if (draggedIndex.value !== null && draggedIndex.value !== toIndex) {
    emit('reorder', draggedIndex.value, toIndex)
  }

  // Reset drag state
  draggedIndex.value = null
  dragOverIndex.value = null
}

const handleDragEnd = () => {
  draggedIndex.value = null
  dragOverIndex.value = null
}
</script>

<template>
  <div v-if="buttons.length === 0" class="empty-state">
    <div class="empty-icon">🎵</div>
    <p>No sounds added yet</p>
    <p class="empty-hint">Click "Add Files" or "Add Folder" to get started</p>
  </div>

  <div v-else class="soundboard-grid">
    <div
      v-for="(button, index) in buttons"
      :key="button.id"
      class="button-wrapper"
      :class="{
        dragging: draggedIndex === index,
        'drag-over': dragOverIndex === index,
      }"
      draggable="true"
      @dragstart="handleDragStart(index)"
      @dragenter="handleDragEnter(index)"
      @dragover="handleDragOver"
      @drop="handleDrop($event, index)"
      @dragend="handleDragEnd"
    >
      <SoundButton
        :button="button"
        :is-playing="getPlayerState(button.id).value.isPlaying"
        @play="emit('play', button)"
        @toggle-loop="emit('toggleLoop', button.id)"
        @remove="emit('remove', button.id)"
      />
    </div>
  </div>
</template>

<style scoped>
.soundboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.button-wrapper {
  cursor: grab;
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.button-wrapper:active {
  cursor: grabbing;
}

.button-wrapper.dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.button-wrapper.drag-over {
  transform: scale(1.05);
  animation: pulse 0.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@media (max-width: 768px) {
  .soundboard-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .soundboard-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 12px;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  margin: 8px 0;
  font-size: 18px;
}

.empty-hint {
  font-size: 14px !important;
  opacity: 0.7;
}
</style>
