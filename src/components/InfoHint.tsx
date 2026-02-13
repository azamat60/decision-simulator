import { Info } from 'lucide-react'

type Props = {
  text: string
}

export const InfoHint = ({ text }: Props) => (
  <span className="inline-flex align-middle" title={text}>
    <Info size={14} className="text-muted" />
  </span>
)
