import { Badge, Input, message, Tag, Tooltip } from 'antd';
import {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';
import cx from 'classnames';
import { useQueryOpenAIPrompt } from '@/common/api/openai';
import { useSelectionManager } from '../../store/selection';
import { List } from '../list';
import { ResultPanel } from '../result-panel';
import { defaultPrompt, PromptCenter } from '../prompts';
import { IcBaselineSend } from '@/components/icon';
import i18next from 'i18next';
import { IcOutlineKeyboardReturn } from '@/components/icon/return';

export const Content: React.FC<PropsWithChildren> = () => {
  return <CenterContent />;
};

const CenterContent = forwardRef<HTMLDivElement>((_, ref) => {
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
    if (!selectionManager.text) {
      return message.warning('No selection');
    }

    setkeyword(item.label);
    setLoading(true);
    setResultPanelVisible(true);
    setQuickPromptVisible(false);

    try {
      queryOpenAIPrompt(
        (item.prompt || defaultPrompt({ role: '', task: item.label }))(
          selectionManager.text
        ),
        (text, err, end) => {
          if (end) {
            setLoading(false);
            return;
          }

          if (err) {
            setResult(err.message);
            setLoading(false);
          } else {
            setResult(text);
          }
        }
      );
    } catch (e) {
      setResult(e.toString());
      setLoading(false);
    }
  }, []);

  const handleClickIcon = useCallback(() => {
    setQuickPromptVisible(true);
    selectionManager.setLock(true);
  }, [setQuickPromptVisible]);

  if (resultPanelVisible) {
    return <ResultPanel loading={loading} content={result} />;
  }

  return (
    <div ref={ref} className="">
      {quickPromptVisible ? null : (
        <div onClick={handleClickIcon}>
          <Tag color="orange" className="cursor-pointer">
            Writely
          </Tag>
        </div>
      )}
      <div
        className={cx('bg-zinc-10000 transition-all duration-500 relative', {
          'w-[700px] shadow-stone-100 shadow-xl block': quickPromptVisible,
          'w-[0px] hidden': !quickPromptVisible,
        })}
      >
        <Input.TextArea
          onPressEnter={() => {
            handleClickItem({ label: keyword });
          }}
          autoSize={{ minRows: 1, maxRows: 4 }}
          placeholder="Ask writely to..."
          value={keyword}
          onChange={(e) => setkeyword(e.target.value)}
        />
        <div>
          <SendToWritelyTip>
            <IcBaselineSend
              className={cx(
                'w-4 h-4 text-gray-300 absolute right-2 bottom-2',
                {
                  'opacity-0': !quickPromptVisible,
                  'opacity-100': quickPromptVisible,
                },
                !!keyword?.trim()?.length
                  ? 'text-zinc-900 cursor-pointer'
                  : 'text-zinc-300'
              )}
            />
          </SendToWritelyTip>
        </div>
      </div>
      <div
        className={cx('w-80 bg-zinc-100 duration-500 transition-shadow', {
          'hidden shadow-xl shadow-stone-100': !quickPromptVisible,
          'block shadow-stone-300 shadow-xl': quickPromptVisible,
        })}
      >
        <List items={items} onClick={handleClickItem} />
      </div>
    </div>
  );
});

const SendToWritelyTip: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Tooltip
      title={
        <div>
          {i18next.t('Send to writely')} <IcOutlineKeyboardReturn />
        </div>
      }
    >
      {children}
    </Tooltip>
  );
};
