import { MaterialSymbolsContentCopyOutline } from '@/components/icon';
import i18next from 'i18next';
import { SVGProps, useCallback } from 'react';
import { BaseAction } from './base-action';

export const Copy: React.FC<{
  dom: React.MutableRefObject<HTMLDivElement>;
}> = ({ dom }) => {
  const handleClick = useCallback(() => {
    if (!dom.current) {
      return;
    }

    const s = window.getSelection();
    s.removeAllRanges();
    s.addRange(new Range());
    s.getRangeAt(0).selectNode(dom.current);

    // TODO: use clipboard to copy
    document.execCommand('copy');

    s.removeAllRanges();
  }, []);

  return (
    <BaseAction
      tooltip={i18next.t('Copy')}
      successTooltip={i18next.t('Copied')}
      onClick={handleClick}
    >
      <MaterialSymbolsContentCopyOutline />
    </BaseAction>
  );
};
