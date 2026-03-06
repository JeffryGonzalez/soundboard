import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'soundboard-db'
const DB_VERSION = 1
const STORE_NAME = 'soundboard-store'

export interface SoundButton {
  id: string
  name: string
  fileHandle: FileSystemFileHandle
  loop: boolean
  createdAt: number
}

let dbInstance: IDBPDatabase | null = null

async function getDB(): Promise<IDBPDatabase> {
  if (dbInstance) {
    return dbInstance
  }

  dbInstance = await openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    },
  })

  return dbInstance
}

export function useIndexedDB() {
  const saveButton = async (button: SoundButton): Promise<void> => {
    const db = await getDB()
    await db.put(STORE_NAME, button)
  }

  const getButton = async (id: string): Promise<SoundButton | undefined> => {
    const db = await getDB()
    return await db.get(STORE_NAME, id)
  }

  const getAllButtons = async (): Promise<SoundButton[]> => {
    const db = await getDB()
    return await db.getAll(STORE_NAME)
  }

  const deleteButton = async (id: string): Promise<void> => {
    const db = await getDB()
    await db.delete(STORE_NAME, id)
  }

  const clearAll = async (): Promise<void> => {
    const db = await getDB()
    await db.clear(STORE_NAME)
  }

  const updateButtonLoop = async (id: string, loop: boolean): Promise<void> => {
    const button = await getButton(id)
    if (button) {
      button.loop = loop
      await saveButton(button)
    }
  }

  return {
    saveButton,
    getButton,
    getAllButtons,
    deleteButton,
    clearAll,
    updateButtonLoop,
  }
}
