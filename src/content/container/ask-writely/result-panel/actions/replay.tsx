import { TablerRefresh } from '@/components/icon';
import i18next from 'i18next';
import { BaseAction } from './base-action';

export const Replay: React.FC = () => {
  return (
    <BaseAction
      tooltip={i18next.t('Regenerate')}
      successTooltip={i18next.t('Success')}
      onClick={() => {
        //
      }}
    >
      <TablerRefresh />
    </BaseAction>
  );
};
