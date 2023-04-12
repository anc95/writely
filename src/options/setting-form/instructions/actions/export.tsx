import { download } from '@/common/file'
import { getSetting } from '@/common/store/settings'
import { Button, message, Popover } from 'antd'
import i18next from 'i18next'
import { useCallback } from 'react'

export const Export: React.FC = () => {
  const handleExport = useCallback(async () => {
    const settings = await getSetting()
    const instructions = settings.customInstructions

    if (!instructions || !instructions?.length) {
      message.error(i18next.t('No data'))
      return
    }

    const blob = new Blob([JSON.stringify(instructions)])
    const url = URL.createObjectURL(blob)

    download(url, 'writely-instructions.json')
  }, [])

  return (
    <Popover content={i18next.t('Export instructions as JSON')}>
      <Button onClick={handleExport}>{i18next.t('Export')}</Button>
    </Popover>
  )
}
