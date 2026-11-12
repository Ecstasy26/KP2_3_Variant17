import { openDB } from 'idb'

const DB_NAME = 'taskflow-db'
const DB_VERSION = 1
let databasePromise = null

export function getDatabase() {
  if (typeof indexedDB === 'undefined') {
    return Promise.reject(new Error('Цей браузер не підтримує IndexedDB.'))
  }

  if (!databasePromise) {
    databasePromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata')
        }
      },
    }).catch((error) => {
      databasePromise = null
      throw error
    })
  }

  return databasePromise
}

export async function readSnapshot() {
  const db = await getDatabase()
  const tx = db.transaction(['tasks', 'projects', 'metadata'], 'readonly')
  const [tasks, projects, initialized, nextProjectId] = await Promise.all([
    tx.objectStore('tasks').getAll(),
    tx.objectStore('projects').getAll(),
    tx.objectStore('metadata').get('initialized'),
    tx.objectStore('metadata').get('nextProjectId'),
    tx.done,
  ])
  return { tasks, projects, initialized: initialized === true, nextProjectId }
}

// Усі три сховища змінюються в одній транзакції.
export async function writeSnapshot(snapshot) {
  const db = await getDatabase()
  const tx = db.transaction(['tasks', 'projects', 'metadata'], 'readwrite')
  const tasks = tx.objectStore('tasks')
  const projects = tx.objectStore('projects')
  const metadata = tx.objectStore('metadata')

  try {
    // Запити виконуються у порядку додавання до транзакції: clear, потім put.
    await Promise.all([
      tasks.clear(),
      projects.clear(),
      ...snapshot.tasks.map((task) => tasks.put(task)),
      ...snapshot.projects.map((project) => projects.put(project)),
      metadata.put(true, 'initialized'),
      metadata.put(snapshot.nextProjectId, 'nextProjectId'),
      tx.done,
    ])
  } catch (error) {
    // Не залишаємо очищені сховища, якщо помилка виникла під час підготовки put.
    try { tx.abort() } catch { /* Транзакція вже могла завершитися або відкотитися. */ }
    await tx.done.catch(() => {})
    throw error
  }
}
