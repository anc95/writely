import { IconBtn } from '@/components/icon-btn';
import { IcBaselineDeleteOutline } from '@/components/icon/delete';
import { IcOutlineCheck } from '@/components/icon/update';
import { Input } from 'antd';
import { useControllableValue } from 'ahooks';
import { useState } from 'react';

export const CustomList: React.FC<{
  value?: string[];
  onChange?: (value: string[]) => void;
}> = (props) => {
  const [value, setValue] = useControllableValue<string[]>(props, {
    defaultValue: [],
  });
  const [inputValue, setInputValue] = useState('');

  return (
    <div>
      <div className="flex gap-4 items-center">
        <Input
          className="w-60"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={() => {
            if (inputValue.trim()) {
              setValue([inputValue.trim(), ...(value || [])]);
              setInputValue('');
            }
          }}
        />
        <IconBtn
          color="green"
          disabled={!inputValue.trim()}
          onClick={() => {
            if (inputValue.trim()) {
              setValue([inputValue.trim(), ...(value || [])]);
              setInputValue('');
            }
          }}
        >
          <IcOutlineCheck />
        </IconBtn>
      </div>
      <div className="flex flex-col gap-2 mt-2 max-h-56 overflow-auto">
        {(value || []).map((p) => {
          return (
            <div className="flex gap-2">
              <div>{p}</div>
              <IconBtn
                color="red"
                onClick={() => setValue((value || []).filter((i) => i !== p))}
              >
                <IcBaselineDeleteOutline />
              </IconBtn>
            </div>
          );
        })}
      </div>
    </div>
  );
};
