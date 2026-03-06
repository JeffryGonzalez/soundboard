<script setup lang="ts">
import { computed } from 'vue'
import type { SoundButton } from '@/composables/useIndexedDB'

interface Props {
  button: SoundButton
  isPlaying: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  play: []
  toggleLoop: []
  remove: []
}>()

const displayName = computed(() => {
  // Remove file extension for cleaner display
  return props.button.name.replace(/\.[^.]+$/, '')
})

const buttonClass = computed(() => ({
  'sound-button': true,
  playing: props.isPlaying,
  looping: props.button.loop,
}))
</script>

<template>
  <div :class="buttonClass">
    <button class="play-button" @click="emit('play')" :aria-label="`Play ${button.name}`">
      <span class="button-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
      <span class="button-name">{{ displayName }}</span>
    </button>

    <div class="button-controls">
      <button
        class="control-btn loop-btn"
        :class="{ active: button.loop }"
        @click="emit('toggleLoop')"
        :aria-label="`Toggle loop for ${button.name}`"
        title="Toggle Loop"
      >
        🔁
      </button>

      <button
        class="control-btn remove-btn"
        @click="emit('remove')"
        :aria-label="`Remove ${button.name}`"
        title="Remove"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style scoped>
.sound-button {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.sound-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.sound-button.playing {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  animation: pulse 2s ease-in-out infinite;
}

.sound-button.looping {
  border: 2px solid #ffd700;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  50% {
    box-shadow: 0 4px 20px rgba(245, 87, 108, 0.4);
  }
}

.play-button {
  width: 100%;
  padding: 20px 16px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.play-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.play-button:active {
  transform: scale(0.98);
}

.button-icon {
  font-size: 20px;
  line-height: 1;
}

.button-name {
  flex: 1;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.button-controls {
  display: flex;
  gap: 8px;
}

.control-btn {
  flex: 1;
  padding: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.loop-btn.active {
  background: rgba(255, 215, 0, 0.5);
  border: 1px solid #ffd700;
}

.remove-btn:hover {
  background: rgba(255, 0, 0, 0.3);
}
</style>
