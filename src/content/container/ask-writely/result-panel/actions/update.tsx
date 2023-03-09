import { TablerRefresh } from '@/components/icon';
import { IcOutlineCheck } from '@/components/icon/update';
import { useResultPanel } from '@/content/container/store/result-panel';
import { useSelectionManager } from '@/content/container/store/selection';
import i18next from 'i18next';
import { useCallback } from 'react';
import { BaseAction } from './base-action';
import { copy } from './copy';

export const Insert: React.FC<{
  dom: React.MutableRefObject<HTMLDivElement>;
}> = ({ dom }) => {
  const selection = useSelectionManager();

  const handleClick = useCallback(() => {
    copy(dom.current);
    selection.append(dom.current?.innerText);
  }, []);

  return (
    <BaseAction
      tooltip={i18next.t('Append text')}
      successTooltip={i18next.t('Inserted')}
      onClick={handleClick}
    >
      <IcOutlineCheck />
    </BaseAction>
  );
};
