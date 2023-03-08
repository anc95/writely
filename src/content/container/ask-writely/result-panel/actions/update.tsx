import { TablerRefresh } from '@/components/icon';
import { IcOutlineCheck } from '@/components/icon/update';
import { useResultPanel } from '@/content/container/store/result-panel';
import { useSelectionManager } from '@/content/container/store/selection';
import i18next from 'i18next';
import { BaseAction } from './base-action';

export const Insert: React.FC = () => {
  const selection = useSelectionManager();
  const { text } = useResultPanel();

  return (
    <BaseAction
      tooltip={i18next.t('Append text')}
      successTooltip={i18next.t('Inserted')}
      onClick={() => {
        selection.append('\n' + text);
      }}
    >
      <IcOutlineCheck />
    </BaseAction>
  );
};
