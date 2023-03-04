import { Input, Spin, Typography } from 'antd';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { useQueryOpenAIPrompt } from '../../../common/api/openai';
import { List } from './list';
import { promptCenter } from './prompts';
import { ResultPanel } from './result-panel';

export const Content = forwardRef<HTMLDivElement, { text: string }>(
  ({ text }, ref) => {
    const [keyword, setkeyword] = useState<string>();
    const queryOpenAIPrompt = useQueryOpenAIPrompt();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const [resultPanelVisible, setResultPanelVisible] = useState(false);
    const items = promptCenter.useDropDownItems(keyword);
    const [quickPromptVisible, setQuickPromptVisible] = useState(false);

    const handleClickItem = useCallback(async (item: typeof items[number]) => {
      setkeyword(item.label);
      setLoading(true);
      setResultPanelVisible(true);

      try {
        setResult(await queryOpenAIPrompt(item.prompt(text)));
      } catch (e) {
        setResult(e.toString());
      } finally {
        setLoading(false);
      }
    }, []);

    const handleOnMouseOver = useCallback(() => {
      setQuickPromptVisible(true);
    }, [setQuickPromptVisible]);

    if (resultPanelVisible) {
      return <ResultPanel loading={loading} content={result} />;
    }

    return (
      <div ref={ref} className="">
        <div className="w-[700px] shadow-2xl shadow-stone-900 bg-white">
          <Input.TextArea
            onMouseOver={handleOnMouseOver}
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Ask writely to..."
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
          />
        </div>
        {quickPromptVisible ? (
          <div className="w-80 shadow-2xl shadow-stone-900 bg-white transition-all">
            <List items={items} onClick={handleClickItem} />
          </div>
        ) : null}
      </div>
    );
  }
);
