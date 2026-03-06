import { ref, computed, onMounted } from 'vue'
import { useIndexedDB, type SoundButton } from './useIndexedDB'
import { useAudioPlayer } from './useAudioPlayer'
import { useFileSystem, type AudioFileInfo } from './useFileSystem'

export function useSoundboard() {
  const buttons = ref<SoundButton[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isInitialized = ref(false)

  const db = useIndexedDB()
  const audioPlayer = useAudioPlayer()
  const fileSystem = useFileSystem()

  const hasButtons = computed(() => buttons.value.length > 0)
  const isFileSystemSupported = computed(() => fileSystem.isFileSystemAccessSupported())

  // Initialize: Load saved buttons from IndexedDB
  const initialize = async (): Promise<void> => {
    if (isInitialized.value) return

    try {
      isLoading.value = true
      error.value = null

      const savedButtons = await db.getAllButtons()
      // Sort by order, or createdAt if order is missing
      buttons.value = savedButtons.sort((a, b) => {
        const orderA = a.order ?? a.createdAt
        const orderB = b.order ?? b.createdAt
        return orderA - orderB
      })

      isInitialized.value = true
    } catch (err) {
      error.value = 'Failed to load saved soundboard'
      console.error('Initialization error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Add files from File System Access API
  const addFiles = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const audioFiles = await fileSystem.selectFiles()

      if (audioFiles.length === 0) {
        return // User cancelled
      }

      await processAudioFiles(audioFiles)
    } catch (err) {
      error.value = 'Failed to add files'
      console.error('Add files error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Add directory from File System Access API
  const addDirectory = async (): Promise<void> => {
    try {
      isLoading.value = true
      error.value = null

      const audioFiles = await fileSystem.selectDirectory()

      if (audioFiles.length === 0) {
        return // User cancelled or no audio files found
      }

      await processAudioFiles(audioFiles)
    } catch (err) {
      error.value = 'Failed to add directory'
      console.error('Add directory error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Process audio files and save to IndexedDB
  const processAudioFiles = async (audioFiles: AudioFileInfo[]): Promise<void> => {
    for (const audioFile of audioFiles) {
      // Check if button already exists
      const existingButton = buttons.value.find((b) => b.name === audioFile.name)

      if (existingButton) {
        continue // Skip duplicates
      }

      // Calculate next order value
      const maxOrder = buttons.value.reduce((max, b) => Math.max(max, b.order ?? 0), 0)

      const newButton: SoundButton = {
        id: crypto.randomUUID(),
        name: audioFile.name,
        fileHandle: audioFile.handle,
        loop: false,
        createdAt: Date.now(),
        order: maxOrder + 1,
      }

      await db.saveButton(newButton)
      buttons.value.push(newButton)
    }
  }

  // Play/stop a sound button
  const toggleSound = async (button: SoundButton): Promise<void> => {
    try {
      // Request permission and get file
      const file = await fileSystem.getFileFromHandle(button.fileHandle)

      if (!file) {
        error.value = `Cannot access file: ${button.name}. Permission may have been denied.`
        return
      }

      // Check if this sound is already playing
      const state = audioPlayer.getPlayerState(button.id)
      const isCurrentlyPlaying = state.value.isPlaying

      // If another sound is playing, stop all sounds first
      if (!isCurrentlyPlaying) {
        audioPlayer.stopAll()
      }

      await audioPlayer.togglePlayback(button.id, file, button.loop)
    } catch (err) {
      error.value = `Failed to play: ${button.name}`
      console.error('Toggle sound error:', err)
    }
  }

  // Toggle loop for a button
  const toggleLoop = async (buttonId: string): Promise<void> => {
    const button = buttons.value.find((b) => b.id === buttonId)
    if (!button) return

    button.loop = !button.loop
    await db.updateButtonLoop(buttonId, button.loop)

    // If currently playing, restart with new loop setting
    const state = audioPlayer.getPlayerState(buttonId)
    if (state.value.isPlaying) {
      const file = await fileSystem.getFileFromHandle(button.fileHandle)
      if (file) {
        audioPlayer.stop(buttonId)
        await audioPlayer.play(buttonId, file, button.loop)
      }
    }
  }

  // Remove a button
  const removeButton = async (buttonId: string): Promise<void> => {
    try {
      audioPlayer.stop(buttonId)
      await db.deleteButton(buttonId)
      audioPlayer.clearCache(buttonId)
      buttons.value = buttons.value.filter((b) => b.id !== buttonId)
    } catch (err) {
      error.value = 'Failed to remove button'
      console.error('Remove button error:', err)
    }
  }

  // Clear all buttons
  const clearAll = async (): Promise<void> => {
    try {
      audioPlayer.stopAll()
      await db.clearAll()
      buttons.value = []
    } catch (err) {
      error.value = 'Failed to clear all buttons'
      console.error('Clear all error:', err)
    }
  }

  // Get player state for a button
  const getButtonState = (buttonId: string) => {
    return audioPlayer.getPlayerState(buttonId)
  }

  // Reorder buttons via drag and drop
  const reorderButtons = async (fromIndex: number, toIndex: number): Promise<void> => {
    try {
      // Validate indices
      if (fromIndex < 0 || fromIndex >= buttons.value.length) return
      if (toIndex < 0 || toIndex >= buttons.value.length) return
      if (fromIndex === toIndex) return

      // Reorder in local array
      const reordered = [...buttons.value]
      const [movedButton] = reordered.splice(fromIndex, 1)

      if (!movedButton) return // Safety check

      reordered.splice(toIndex, 0, movedButton)

      // Update order property for all buttons
      reordered.forEach((button, index) => {
        button.order = index
      })

      buttons.value = reordered

      // Save all updated buttons to IndexedDB
      await db.saveAllButtons(reordered)
    } catch (err) {
      error.value = 'Failed to reorder buttons'
      console.error('Reorder error:', err)
    }
  }

  onMounted(() => {
    initialize()
  })

  return {
    // State
    buttons,
    isLoading,
    error,
    hasButtons,
    isFileSystemSupported,

    // Actions
    initialize,
    addFiles,
    addDirectory,
    toggleSound,
    toggleLoop,
    removeButton,
    clearAll,
    getButtonState,
    reorderButtons,
  }
}
