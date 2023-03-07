import { SystemUiconsWrite } from '@/components/icon';
import { Button, Spin } from 'antd';
import i18next from 'i18next';
import { useCallback, useRef } from 'react';
import { useSelectionManager } from '../../store/selection';
import mdit from 'markdown-it';
import hljsPlugin from 'markdown-it-highlightjs';
import { Actions } from './actions';
import { Copy } from './actions/copy';

const md = mdit().use(hljsPlugin);

export const Content: React.FC<{ loading: boolean; content: string }> = ({
  loading,
  content,
}) => {
  const selectionManager = useSelectionManager();
  const mdContainerRef = useRef<HTMLDivElement>();

  const handleAppend = useCallback(() => {
    selectionManager.append(content);
  }, [content]);

  const handleReplace = useCallback(() => {
    selectionManager.replace(content);
  }, [content]);

  const parsedContent = md.render(content);

  return (
    <div className="shadow-2xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto">
        <div className="whitespace-pre-wrap">
          <div
            ref={mdContainerRef}
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          ></div>
          {loading ? <WritingAnimation /> : null}
        </div>
      </div>
      <div className="h-16">
        <Actions>
          <Copy dom={mdContainerRef} />
        </Actions>
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
