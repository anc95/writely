import { SystemUiconsWrite } from '@/components/icon';
import { Button, Spin } from 'antd';
import i18next from 'i18next';
import { useCallback } from 'react';
import { useSelectionManager } from '../../store/selection';

export const Content: React.FC<{ loading: boolean; content: string }> = ({
  loading,
  content,
}) => {
  const selectionManager = useSelectionManager();

  const handleAppend = useCallback(() => {
    selectionManager.append(content);
  }, [content]);

  const handleReplace = useCallback(() => {
    selectionManager.replace(content);
  }, [content]);

  return (
    <div className="shadow-2xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto">
        <pre className="whitespace-pre-wrap">
          {content}
          {loading ? <WritingAnimation /> : null}
        </pre>
      </div>
      <div className="border-t border-gray-200 px-4 py-2 flex gap-3">
        <Button onClick={handleReplace}>{i18next.t('Replace')}</Button>
        <Button onClick={handleAppend}>{i18next.t('Append')}</Button>
      </div>
    </div>
  );
};

const WritingAnimation: React.FC = () => {
  return (
    <div className="animate-swaying inline-block">
      <SystemUiconsWrite />
    </div>
  );
};
