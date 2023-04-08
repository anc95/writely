import { Instruction } from '@/options/types'
import { Add } from './actions/add'
import { InstructionModal } from './instruction-modal'
import { List } from './list'
import { ModalStateProvider } from './modal-state'

export const Instructions: React.FC<{ value?: Instruction[] }> = ({
  value,
}) => {
  return (
    <ModalStateProvider>
      <div>
        <div className="flex gap-2 mb-2">
          <Add />
        </div>
        <List value={value} />
        <InstructionModal />
      </div>
    </ModalStateProvider>
  )
}
