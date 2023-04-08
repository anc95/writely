import { Instruction } from '@/options/types'
import { useCallback, useState } from 'react'
import { createContainer } from 'unstated-next'

const { useContainer: useModalState, Provider: ModalStateProvider } =
  createContainer(() => {
    const [isOpen, setIsOpen] = useState<boolean>()
    const [editTarget, setEditTarget] = useState<Instruction>()

    const reset = useCallback(() => {
      setIsOpen(false)
      setEditTarget(undefined)
    }, [])

    return {
      isOpen,
      setIsOpen,
      editTarget,
      setEditTarget,
      reset,
    }
  })

export { useModalState, ModalStateProvider }
