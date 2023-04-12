import { batchAdd } from '@/common/api/instructions'
import { useSettings } from '@/common/store/settings'
import { Button, message, Popover, Upload } from 'antd'
import i18next from 'i18next'
import { debounce } from 'lodash-es'
import { useCallback, useState } from 'react'

export const Import: React.FC = () => {
  const { refresh } = useSettings()
  const [loading, setLoading] = useState(false)

  const handleUploadChange = useCallback(
    debounce(
      async (file: File) => {
        try {
          setLoading(true)
          const text = await file.text()
          const json = JSON.parse(text)
          await batchAdd(json)
          await refresh()
          message.success(i18next.t('😄 Imported successfully'))
        } catch {
          message.error(i18next.t('😭 Error format'))
        } finally {
          setLoading(false)
        }
      },
      1000,
      { leading: true, trailing: false }
    ),
    []
  )

  console.log(loading)

  return (
    <Popover content={i18next.t('Import instructions')}>
      <Upload
        accept=".json"
        showUploadList={false}
        onChange={({ file }) => handleUploadChange(file.originFileObj)}
      >
        <Button loading={loading}>{i18next.t('Import')}</Button>
      </Upload>
    </Popover>
  )
}
