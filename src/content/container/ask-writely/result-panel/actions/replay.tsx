import { TablerRefresh } from '@/components/icon'
import { useResultPanel } from '@/content/container/store/result-panel'
import i18next from 'i18next'
import { BaseAction } from './base-action'

export const Replay: React.FC = () => {
  const { setLoading, setIsError } = useResultPanel()

  return (
    <BaseAction
      tooltip={i18next.t('Regenerate')}
      successTooltip={i18next.t('Success')}
      onClick={() => {
        setLoading(true)
        setIsError(false)
      }}
    >
      <TablerRefresh />
    </BaseAction>
  )
}
