import { PropsWithChildren, useMemo } from 'react'
import cx from 'classnames'

export const IconBtn: React.FC<
  PropsWithChildren<{
    disabled?: boolean
    color?: 'green' | 'gray' | 'orange' | 'red' | 'blue'
    className?: string
    onClick?: () => void
  }>
> = ({ color, className, onClick, children, disabled }) => {
  const colorClass = useMemo(() => {
    switch (color) {
      case 'green':
        return 'text-green-400 hover:text-green-500'
      case 'gray':
        return 'text-gray-400 hover:text-gray-500'
      case 'orange':
        return 'text-orange-400 hover:text-orange-500'
      case 'red':
        return 'text-red-400 hover:text-red-500'
      case 'blue':
        return 'text-blue-400 hover:text-blue-500'
      default:
        return ''
    }
  }, [])

  if (disabled) {
    return null
  }

  return (
    <div
      className={cx(
        colorClass,
        'transition-all duration-500 p-1 flex items-center justify-center hover:bg-slate-200 rounded-none hover:rounded-md text-base bg-slate-100 cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
