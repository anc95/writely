import { Input, message } from 'antd';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { useQueryOpenAIPrompt } from '../../../common/api/openai';
import { useSelectionManager } from '../store/selection';
import { List } from './list';
import { ResultPanel } from './result-panel';
import { PromptCenter } from './prompts';

export const Content = forwardRef<HTMLDivElement>((_, ref) => {
  const [keyword, setkeyword] = useState<string>();
  const queryOpenAIPrompt = useQueryOpenAIPrompt();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [resultPanelVisible, setResultPanelVisible] = useState(false);
  const [quickPromptVisible, setQuickPromptVisible] = useState(false);
  const selectionManager = useSelectionManager();
  const promptCenter = useMemo(() => new PromptCenter(), []);
  const items = promptCenter.useDropDownItems(keyword);

  const handleClickItem = useCallback(async (item: typeof items[number]) => {
    setkeyword(item.label);
    setLoading(true);
    setResultPanelVisible(true);
    setQuickPromptVisible(false);

    if (!selectionManager.text) {
      return message.warning('No selection');
    }

    try {
      queryOpenAIPrompt(item.prompt(selectionManager.text), (text, err) => {
        if (err) {
          setResult(err.message);
        } else {
          setResult(text);
        }
      });
    } catch (e) {
      setResult(e.toString());
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOnFoucus = useCallback(() => {
    setQuickPromptVisible(true);
    selectionManager.setLock(true);
  }, [setQuickPromptVisible]);

  if (resultPanelVisible) {
    return <ResultPanel loading={loading} content={result} />;
  }

  return (
    <div ref={ref} className="">
      <div
        className={cx('bg-zinc-10000 transition-all duration-500', {
          'w-[700px] shadow-stone-100 shadow-xl': quickPromptVisible,
          'w-[200px] shadow-stone-300 shadow-2xl': !quickPromptVisible,
        })}
      >
        <Input.TextArea
          onFocus={handleOnFoucus}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Ask writely to..."
          value={keyword}
          onChange={(e) => setkeyword(e.target.value)}
        />
      </div>
      <div
        className={cx('w-80 bg-zinc-100 duration-500 transition-shadow', {
          'hidden shadow-xl shadow-stone-100': !quickPromptVisible,
          'block shadow-stone-300 shadow-2xl': quickPromptVisible,
        })}
      >
        <List items={items} onClick={handleClickItem} />
      </div>
    </div>
  );
});
