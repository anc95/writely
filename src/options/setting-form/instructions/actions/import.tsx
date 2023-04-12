import { Button, Popover, Upload } from 'antd'
import i18next from 'i18next'
import { useModalState } from '../modal-state'

export const Import: React.FC = () => {
  const { setIsOpen } = useModalState()

  return (
    <Popover content={i18next.t('Import instructions')}>
      <Upload
        disabled
        accept=".json"
        showUploadList={false}
        onChange={async ({ file }) => {
          console.log(await file.originFileObj.text())
        }}
      >
        <Button onClick={() => setIsOpen(true)}>{i18next.t('Import')}</Button>
      </Upload>
    </Popover>
  )
}
