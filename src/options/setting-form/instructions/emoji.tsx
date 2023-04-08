import { useControllableValue } from 'ahooks'
import { Popover } from 'antd'
import EmojiPicker from 'emoji-picker-react'
import { useEffect } from 'react'

export const Emoji: React.FC<{
  value?: string
  onChange?: (value: string) => void
}> = (props) => {
  const [value, setValue] = useControllableValue(props)

  useEffect(() => {
    if (!value) {
      setValue('😄')
    }
  }, [value])

  return (
    <Popover content={<EmojiPicker onEmojiClick={(e) => setValue(e.emoji)} />}>
      <div className="w-10 h-10 flex items-center justify-center text-xl rounded-md bg-slate-200 cursor-pointer">
        {value}
      </div>
    </Popover>
  )
}
