import { MaterialSymbolsContentCopyOutline } from '@/components/icon';
import { BiFileCheck } from '@/components/icon/replace';
import { useSelectionManager } from '@/content/container/store/selection';
import i18next from 'i18next';
import { useCallback } from 'react';
import { BaseAction } from './base-action';
import { copy } from './copy';

export const Replace: React.FC<{
  dom: React.MutableRefObject<HTMLDivElement>;
}> = ({ dom }) => {
  const selection = useSelectionManager();

  const handleClick = useCallback(() => {
    copy(dom.current);
    return selection.replace(dom.current.innerText);
  }, []);

  return (
    <BaseAction
      tooltip={i18next.t('Replace text')}
      successTooltip={i18next.t('Replaced')}
      onClick={handleClick}
    >
      <BiFileCheck />
    </BaseAction>
  );
};
