import { Dropdown, Input, Spin, Typography } from 'antd';
import { forwardRef, useMemo, useState } from 'react';
import { useQueryOpenAIPrompt } from '../../../common/api/openai';
import { promptCenter } from './prompts';

export const Content = forwardRef<HTMLDivElement, { text: string }>(
  ({ text }, ref) => {
    const [keyword, setkeyword] = useState<string>();
    const queryOpenAIPrompt = useQueryOpenAIPrompt();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');
    const items = promptCenter.useDropDownItems(keyword);
    const itemsEle = useMemo(() => {
      return items.map((item) => {
        return {
          key: item.key,
          label: (
            <div
              onClick={async () => {
                setkeyword(item.label);
                setLoading(true);

                try {
                  setResult(await queryOpenAIPrompt(item.prompt(text)));
                } catch (e) {
                  setResult(e.toString());
                } finally {
                  setLoading(false);
                }
              }}
            >
              {item.label}
            </div>
          ),
        };
      });
    }, [items]);

    return (
      <div ref={ref} className="max-w-xl">
        <Dropdown
          menu={{ items: itemsEle }}
          getPopupContainer={(t) => t.parentElement}
        >
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 4 }}
            placeholder="Ask writely to..."
            value={keyword}
            onChange={(e) => setkeyword(e.target.value)}
          />
        </Dropdown>
        {loading ? (
          <Spin />
        ) : (
          result && (
            <Typography>
              <pre>{result}</pre>
            </Typography>
          )
        )}
      </div>
    );
  }
);
