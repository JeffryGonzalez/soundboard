import { ref, type Ref } from 'vue'

interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
}

export function useAudioPlayer() {
  const audioContext = ref<AudioContext | null>(null)
  const activeSources = new Map<string, AudioBufferSourceNode>()
  const audioBuffers = new Map<string, AudioBuffer>()
  const playerStates = new Map<string, Ref<AudioPlayerState>>()

  const initAudioContext = (): AudioContext => {
    if (!audioContext.value) {
      audioContext.value = new AudioContext()
    }
    return audioContext.value
  }

  const decodeAudioFile = async (file: File): Promise<AudioBuffer> => {
    const ctx = initAudioContext()
    const arrayBuffer = await file.arrayBuffer()
    return await ctx.decodeAudioData(arrayBuffer)
  }

  const play = async (id: string, file: File, loop: boolean = false): Promise<void> => {
    // Stop if already playing
    if (activeSources.has(id)) {
      stop(id)
    }

    const ctx = initAudioContext()

    // Resume context if suspended (required by browser autoplay policies)
    if (ctx.state === 'suspended') {
      await ctx.resume()
    }

    let buffer = audioBuffers.get(id)

    // Decode if not cached
    if (!buffer) {
      buffer = await decodeAudioFile(file)
      audioBuffers.set(id, buffer)
    }

    // Create source and connect to destination
    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.loop = loop
    source.connect(ctx.destination)

    // Store source for later control
    activeSources.set(id, source)

    // Update state
    const state = getPlayerState(id)
    state.value.isPlaying = true
    state.value.duration = buffer.duration

    // Handle playback end
    source.onended = () => {
      if (!loop) {
        activeSources.delete(id)
        state.value.isPlaying = false
        state.value.currentTime = 0
      }
    }

    source.start(0)
  }

  const stop = (id: string): void => {
    const source = activeSources.get(id)
    if (source) {
      try {
        source.stop()
        source.disconnect()
      } catch (e) {
        // Source might already be stopped
        console.warn('Error stopping audio source:', e)
      }
      activeSources.delete(id)

      const state = getPlayerState(id)
      state.value.isPlaying = false
      state.value.currentTime = 0
    }
  }

  const togglePlayback = async (id: string, file: File, loop: boolean = false): Promise<void> => {
    if (activeSources.has(id)) {
      stop(id)
    } else {
      await play(id, file, loop)
    }
  }

  const getPlayerState = (id: string): Ref<AudioPlayerState> => {
    if (!playerStates.has(id)) {
      playerStates.set(
        id,
        ref({
          isPlaying: false,
          currentTime: 0,
          duration: 0,
        }),
      )
    }
    return playerStates.get(id)!
  }

  const clearCache = (id?: string): void => {
    if (id) {
      audioBuffers.delete(id)
      playerStates.delete(id)
    } else {
      audioBuffers.clear()
      playerStates.clear()
    }
  }

  const stopAll = (): void => {
    activeSources.forEach((_, id) => stop(id))
  }

  return {
    play,
    stop,
    togglePlayback,
    getPlayerState,
    clearCache,
    stopAll,
    audioContext,
  }
}
