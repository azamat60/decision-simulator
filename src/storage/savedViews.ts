import type { SavedView } from '../domain/types'

export const exportSavedViews = (views: SavedView[]): string => JSON.stringify(views, null, 2)

export const importSavedViews = (raw: string): SavedView[] => {
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('Expected an array of saved views')
  }

  return parsed
    .filter((view) => view && typeof view === 'object')
    .map((view) => ({
      id: String(view.id),
      name: String(view.name),
      simulator: view.simulator === 'timeRoi' ? 'timeRoi' : 'finance',
      params: view.params,
      createdAt: String(view.createdAt),
      updatedAt: String(view.updatedAt)
    }))
}
