import type { Toast as ToastData } from '../app/types'

type Props = {
  toast: ToastData | null
}

export const Toast = ({ toast }: Props) => {
  if (!toast) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 rounded-xl border border-border bg-surface px-4 py-2 text-sm shadow-soft">
      {toast.message}
    </div>
  )
}
