import { SystemUiconsWrite } from '@/components/icon';
import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import mdit from 'markdown-it';
import hljsPlugin from 'markdown-it-highlightjs';
import { Actions } from './actions';
import { Copy } from './actions/copy';
import { Replay } from './actions/replay';
import cx from 'classnames';
import { useSelectionManager } from '../../store/selection';
import { message } from 'antd';
import { useOpenAIEditPrompt } from '@/common/api/openai';
import { useResultPanel } from '../../store/result-panel';
import { Insert } from './actions/update';
import { Replace } from './actions/replace';

const md = mdit().use(hljsPlugin);

export const Content: React.FC<{ text: string }> = ({ text: task }) => {
  const mdContainerRef = useRef<HTMLDivElement>();
  const selectionManager = useSelectionManager();
  const queryOpenAIPrompt = useOpenAIEditPrompt();
  const {
    result,
    setResult,
    loading,
    setLoading,
    setText,
    text: resultText,
  } = useResultPanel();
  const sequenceRef = useRef<number>(0);
  const { isOriginText } = useResultPanel();

  const handleQuery = useCallback(async () => {
    if (!selectionManager.text) {
      return message.warning('No selection');
    }

    sequenceRef.current += 1;
    const currentSequence = sequenceRef.current;

    const handler = (text: string, err: Error, end: boolean) => {
      if (currentSequence != sequenceRef.current) {
        return;
      }

      if (end) {
        setText(text);
        setLoading(false);
        return;
      }

      if (err) {
        setText(err.message);
        setLoading(false);
      } else {
        setText(text);
      }
    };

    try {
      queryOpenAIPrompt(selectionManager.text, task, handler);
      // queryOpenAIEdit(selectionManager.text, text, handler);
    } catch (e) {
      setResult(e.toString());
      setLoading(false);
    }
  }, [queryOpenAIPrompt]);

  useEffect(() => {
    if (loading) {
      setResult('');
      setText('');
      handleQuery();
    }
  }, [loading]);

  useEffect(() => {
    if (!isOriginText) {
      setResult(md.render(resultText));
    } else {
      setResult(resultText);
    }
  }, [isOriginText, resultText]);

  useEffect(() => setLoading(true), []);

  return (
    <div className="shadow-xl bg-zinc-100">
      <div className="p-4 max-h-[50vh] overflow-auto transition-all duration-700">
        <div
          ref={mdContainerRef}
          className="transition-all duration-500"
          dangerouslySetInnerHTML={{ __html: result }}
        ></div>
        {loading ? (
          <div className="flex justify-center text-4xl text-[#925761]">
            <WritingAnimation />
          </div>
        ) : null}
      </div>
      <div
        className={cx(
          'h-10 flex items-center justify-center border-t border-zinc-200 transition-all duration-700',
          loading ? 'opacity-0 !h-0' : 'opacity-100'
        )}
      >
        {loading ? null : (
          <Actions>
            <Replace dom={mdContainerRef} />
            <Insert dom={mdContainerRef} />
            <Copy dom={mdContainerRef} />
            <Replay />
          </Actions>
        )}
      </div>
    </div>
  );
};

const WritingAnimation: React.FC = () => {
  const divRef = useRef<HTMLDivElement>();

  useWritingAnimationEffect(divRef);

  return (
    <div className="animate-swaying inline-block" ref={divRef}>
      <SystemUiconsWrite />
    </div>
  );
};

const useWritingAnimationEffect = (ref: MutableRefObject<HTMLDivElement>) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio !== 1) {
          ref.current.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);
};
