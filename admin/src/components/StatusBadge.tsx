import clsx from 'clsx'
import { IconCircleFilled } from '@tabler/icons-react'

interface Props {
  status: 'active' | 'inactive'
}

export default function StatusBadge({ status }: Props) {
  return (
    <span className={clsx(status === 'active' ? 'badge-active' : 'badge-inactive')}>
      <IconCircleFilled size={6} />
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  )
}
