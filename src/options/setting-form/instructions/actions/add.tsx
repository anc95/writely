import { Button, Popover } from 'antd'
import i18next from 'i18next'
import { useModalState } from '../modal-state'

export const Add: React.FC = () => {
  const { setIsOpen } = useModalState()

  return (
    <Popover title="Add new instruction">
      <Button onClick={() => setIsOpen(true)}>{i18next.t('Add')}</Button>
    </Popover>
  )
}
