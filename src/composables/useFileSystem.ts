export interface AudioFileInfo {
  name: string
  handle: FileSystemFileHandle
  file: File
}

const AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.aac', '.flac', '.webm', '.opus']

export function useFileSystem() {
  const isFileSystemAccessSupported = (): boolean => {
    return 'showOpenFilePicker' in window && 'showDirectoryPicker' in window
  }

  const isAudioFile = (filename: string): boolean => {
    const lower = filename.toLowerCase()
    return AUDIO_EXTENSIONS.some((ext) => lower.endsWith(ext))
  }

  const selectFiles = async (): Promise<AudioFileInfo[]> => {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API is not supported in this browser')
    }

    try {
      const handles = await window.showOpenFilePicker({
        multiple: true,
        types: [
          {
            description: 'Audio Files',
            accept: {
              'audio/*': AUDIO_EXTENSIONS,
            },
          },
        ],
      })

      const audioFiles: AudioFileInfo[] = []

      for (const handle of handles) {
        if (isAudioFile(handle.name)) {
          const file = await handle.getFile()
          audioFiles.push({
            name: handle.name,
            handle,
            file,
          })
        }
      }

      return audioFiles
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled the picker
        return []
      }
      throw error
    }
  }

  const selectDirectory = async (): Promise<AudioFileInfo[]> => {
    if (!isFileSystemAccessSupported()) {
      throw new Error('File System Access API is not supported in this browser')
    }

    try {
      const dirHandle = await window.showDirectoryPicker()
      const audioFiles: AudioFileInfo[] = []

      // Recursively scan directory
      await scanDirectory(dirHandle, audioFiles)

      return audioFiles
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User cancelled the picker
        return []
      }
      throw error
    }
  }

  const scanDirectory = async (
    dirHandle: FileSystemDirectoryHandle,
    audioFiles: AudioFileInfo[],
  ): Promise<void> => {
    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'file' && isAudioFile(entry.name)) {
        const fileHandle = entry as FileSystemFileHandle
        const file = await fileHandle.getFile()
        audioFiles.push({
          name: entry.name,
          handle: fileHandle,
          file,
        })
      } else if (entry.kind === 'directory') {
        // Recursively scan subdirectories
        await scanDirectory(entry as FileSystemDirectoryHandle, audioFiles)
      }
    }
  }

  const verifyPermission = async (
    handle: FileSystemFileHandle,
    readWrite: boolean = false,
  ): Promise<boolean> => {
    const options: FileSystemHandlePermissionDescriptor = {
      mode: readWrite ? 'readwrite' : 'read',
    }

    // Check if permission was already granted
    if ((await handle.queryPermission(options)) === 'granted') {
      return true
    }

    // Request permission
    if ((await handle.requestPermission(options)) === 'granted') {
      return true
    }

    return false
  }

  const getFileFromHandle = async (handle: FileSystemFileHandle): Promise<File | null> => {
    try {
      // Verify we have permission to read the file
      if (!(await verifyPermission(handle))) {
        console.warn('Permission denied for file:', handle.name)
        return null
      }

      return await handle.getFile()
    } catch (error) {
      console.error('Error reading file:', error)
      return null
    }
  }

  return {
    isFileSystemAccessSupported,
    selectFiles,
    selectDirectory,
    verifyPermission,
    getFileFromHandle,
    isAudioFile,
  }
}
