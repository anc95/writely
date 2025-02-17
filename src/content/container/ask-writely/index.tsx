import { MutableRefObject, useRef } from 'react'
import ReactDraggable from 'react-draggable'
import { useSelectionManager } from '../store/selection'
import { useView } from '../store/view'
import { Content } from './content'

let fixedRef: MutableRefObject<HTMLDivElement>

export const AskWritely: React.FC = () => {
  const selectionManager = useSelectionManager()
  const { position } = selectionManager
  const { viewStatus } = useView()
  const _fixedRef = useRef<HTMLDivElement>()

  fixedRef = _fixedRef

  if (viewStatus === 'none') {
    return null
  }

  const showIcon = viewStatus === 'icon'

  const content = (
    <div
      ref={_fixedRef}
      style={{
        position: 'fixed',
        top: `${
          showIcon
            ? position.y
            : position.y + 300 > window.innerHeight
            ? position.y - 300
            : position.y
        }px`,
        left: `${
          showIcon ? position.x : Math.min(position.x, window.innerWidth - 320)
        }px`,
        zIndex: 9999999999999,
      }}
    >
      <Content />
    </div>
  )

  if (viewStatus === 'icon') {
    return content
  }

  return <ReactDraggable handle=".handle">{content}</ReactDraggable>
}

export const getFixedDom = () => {
  return fixedRef.current
}
