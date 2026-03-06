import { openDB, type IDBPDatabase } from 'idb'

const DB_NAME = 'soundboard-db'
const DB_VERSION = 2
const STORE_NAME = 'soundboard-store'

export interface SoundButton {
  id: string
  name: string
  fileHandle: FileSystemFileHandle
  loop: boolean
  createdAt: number
  order: number
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

  const updateButtonOrder = async (id: string, order: number): Promise<void> => {
    const button = await getButton(id)
    if (button) {
      button.order = order
      await saveButton(button)
    }
  }

  const saveAllButtons = async (buttons: SoundButton[]): Promise<void> => {
    const db = await getDB()
    const tx = db.transaction(STORE_NAME, 'readwrite')

    // Add all put operations to the transaction
    for (const button of buttons) {
      tx.store.put(button)
    }

    await tx.done
  }

  return {
    saveButton,
    getButton,
    getAllButtons,
    deleteButton,
    clearAll,
    updateButtonLoop,
    updateButtonOrder,
    saveAllButtons,
  }
}
