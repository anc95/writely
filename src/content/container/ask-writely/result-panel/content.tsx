import { SystemUiconsWrite } from '@/components/icon';
import { useCallback, useEffect, useRef, useState } from 'react';
import mdit from 'markdown-it';
import hljsPlugin from 'markdown-it-highlightjs';
import { Actions } from './actions';
import { Copy } from './actions/copy';
import { Replay } from './actions/replay';
import cx from 'classnames';
import { useSelectionManager } from '../../store/selection';
import { message } from 'antd';
import { useQueryOpenAIPrompt } from '@/common/api/openai';
import { defaultPrompt } from '../prompts';
import { useResultPanel } from '../../store/result-panel';

const md = mdit().use(hljsPlugin);

export const Content: React.FC<{ text: string }> = ({ text }) => {
  const mdContainerRef = useRef<HTMLDivElement>();
  const selectionManager = useSelectionManager();
  const queryOpenAIPrompt = useQueryOpenAIPrompt();
  const { result, setResult, loading, setLoading } = useResultPanel();
  const sequenceRef = useRef<number>(0);

  const handleQuery = useCallback(async () => {
    if (!selectionManager.text) {
      return message.warning('No selection');
    }

    sequenceRef.current += 1;
    const currentSequence = sequenceRef.current;

    try {
      queryOpenAIPrompt(
        // Todo: prompt optimization
        defaultPrompt({ role: '', task: text })(selectionManager.text),
        (text, err, end) => {
          if (currentSequence != sequenceRef.current) {
            return;
          }

          if (end) {
            setLoading(false);
            return;
          }

          if (err) {
            setResult(err.message);
            setLoading(false);
          } else {
            setResult(md.render(text));
          }
        }
      );
    } catch (e) {
      setResult(e.toString());
      setLoading(false);
    }
  }, [queryOpenAIPrompt]);

  useEffect(() => {
    if (loading) {
      setResult('');
      handleQuery();
    }
  }, [loading]);

  useEffect(() => setLoading(true), []);

  return (
    <div className="shadow-xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto">
        <div className="whitespace-pre-wrap">
          <div
            ref={mdContainerRef}
            className="transition-all"
            dangerouslySetInnerHTML={{ __html: result }}
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
