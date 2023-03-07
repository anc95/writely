import { SystemUiconsWrite } from '@/components/icon';
import { Button, Spin } from 'antd';
import i18next from 'i18next';
import { useCallback, useRef } from 'react';
import { useSelectionManager } from '../../store/selection';
import mdit from 'markdown-it';
import hljsPlugin from 'markdown-it-highlightjs';
import { Actions } from './actions';
import { Copy } from './actions/copy';
import { Replay } from './actions/replay';
import cx from 'classnames';

const md = mdit().use(hljsPlugin);

export const Content: React.FC<{ loading: boolean; content: string }> = ({
  loading,
  content,
}) => {
  const mdContainerRef = useRef<HTMLDivElement>();
  const parsedContent = md.render(content);

  return (
    <div className="shadow-2xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto">
        <div className="whitespace-pre-wrap">
          <div
            ref={mdContainerRef}
            className="transition-all"
            dangerouslySetInnerHTML={{ __html: parsedContent }}
          ></div>
          {loading ? (
            <div className="flex justify-center text-4xl text-[#925761]">
              <WritingAnimation />
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={cx(
          'h-10 flex items-center justify-center border-t border-zinc-200',
          loading ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Actions>
          <Copy dom={mdContainerRef} />
          <Replay />
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
