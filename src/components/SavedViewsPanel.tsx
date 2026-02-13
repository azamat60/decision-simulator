import { Download, Pencil, Trash2, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { dateTime } from '../app/format'
import type { SavedView } from '../domain/types'
import { exportSavedViews, importSavedViews } from '../storage/savedViews'

type Props = {
  views: SavedView[]
  onLoad: (id: string) => void
  onRename: (id: string, name: string) => void
  onDelete: (id: string) => void
  onImport: (views: SavedView[]) => void
}

export const SavedViewsPanel = ({ views, onLoad, onRename, onDelete, onImport }: Props) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draftName, setDraftName] = useState('')
  const [importText, setImportText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const exported = useMemo(() => exportSavedViews(views), [views])

  const download = () => {
    const blob = new Blob([exported], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'decision-simulator-views.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const runImport = () => {
    try {
      onImport(importSavedViews(importText))
      setImportText('')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={download}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-muted transition hover:text-text"
          >
            <Download size={14} />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-3 py-2 text-sm text-muted transition hover:text-text"
          >
            <Upload size={14} />
            Import File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/json"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (!file) {
                return
              }
              const text = await file.text()
              try {
                onImport(importSavedViews(text))
              } catch (error) {
                console.error(error)
              }
            }}
          />
        </div>
        <textarea
          className="h-40 w-full rounded-xl border border-border bg-bg p-3 text-sm"
          placeholder="Paste saved views JSON to import"
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
        />
        <button
          type="button"
          onClick={runImport}
          className="mt-3 rounded-xl bg-gradient-to-r from-accent to-accent2 px-4 py-2 text-sm font-medium text-slate-950"
        >
          Import JSON
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
        <h2 className="mb-4 text-lg font-semibold">Saved Configurations</h2>
        {views.length === 0 ? (
          <p className="text-sm text-muted">No views saved yet.</p>
        ) : (
          <ul className="space-y-3">
            {views.map((view) => (
              <li
                key={view.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-bg px-3 py-2"
              >
                <div>
                  {editingId === view.id ? (
                    <input
                      value={draftName}
                      onChange={(event) => setDraftName(event.target.value)}
                      className="rounded-lg border border-border bg-surface px-2 py-1"
                    />
                  ) : (
                    <p className="font-medium">{view.name}</p>
                  )}
                  <p className="text-xs text-muted">
                    {view.simulator} • Updated {dateTime(view.updatedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onLoad(view.id)}
                    className="rounded-lg border border-border px-2 py-1 text-xs"
                  >
                    Load
                  </button>
                  {editingId === view.id ? (
                    <button
                      type="button"
                      onClick={() => {
                        onRename(view.id, draftName)
                        setEditingId(null)
                      }}
                      className="rounded-lg border border-border px-2 py-1 text-xs"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(view.id)
                        setDraftName(view.name)
                      }}
                      className="rounded-lg border border-border p-1"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(view.id)}
                    className="rounded-lg border border-border p-1 text-negative"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
