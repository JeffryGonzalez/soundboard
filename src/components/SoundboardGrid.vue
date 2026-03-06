<script setup lang="ts">
import { type Ref } from 'vue'
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
}>()
</script>

<template>
  <div v-if="buttons.length === 0" class="empty-state">
    <div class="empty-icon">🎵</div>
    <p>No sounds added yet</p>
    <p class="empty-hint">Click "Add Files" or "Add Folder" to get started</p>
  </div>

  <div v-else class="soundboard-grid">
    <SoundButton
      v-for="button in buttons"
      :key="button.id"
      :button="button"
      :is-playing="getPlayerState(button.id).value.isPlaying"
      @play="emit('play', button)"
      @toggle-loop="emit('toggleLoop', button.id)"
      @remove="emit('remove', button.id)"
    />
  </div>
</template>

<style scoped>
.soundboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
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
