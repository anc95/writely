import { addOne, update } from '@/common/api/instructions'
import { useSettings } from '@/common/store/settings'
import { Form, Input, Modal } from 'antd'
import i18next from 'i18next'
import { useCallback, useEffect, useState } from 'react'
import { Emoji } from './emoji'
import { useModalState } from './modal-state'

const { TextArea } = Input

export const InstructionModal: React.FC = () => {
  const { isOpen, reset, editTarget } = useModalState()
  const { refresh } = useSettings()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleOk = useCallback(async () => {
    try {
      setLoading(true)
      const value = await form.validateFields()

      if (editTarget) {
        await update({
          ...editTarget,
          ...value,
        })
      } else {
        await addOne(value)
      }

      reset()
      await refresh()
    } finally {
      setLoading(false)
    }
  }, [form, editTarget])

  useEffect(() => {
    if (!isOpen) {
      form.setFieldsValue({})
    } else {
      if (editTarget) {
        form.setFieldsValue(editTarget)
      } else {
        form.resetFields()
      }
    }
  }, [isOpen])

  return (
    <Modal
      open={isOpen}
      title={i18next.t('Create new instruction')}
      cancelText={i18next.t('Cancel')}
      okText={i18next.t('Ok')}
      onOk={handleOk}
      okButtonProps={{ loading }}
      onCancel={reset}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label={i18next.t('Icon')}
          name={'icon'}
          required
          rules={[{ required: true }]}
        >
          <Emoji />
        </Form.Item>
        <Form.Item
          label={i18next.t('Name')}
          name={'name'}
          required
          rules={[{ required: true }]}
        >
          <Input
            placeholder={i18next.t('Enter the instruction name...')}
          ></Input>
        </Form.Item>
        <Form.Item
          label={i18next.t('Instruction')}
          name={'instruction'}
          required
          rules={[{ required: true }]}
        >
          <TextArea
            placeholder={i18next.t('Example: Write an email to my boss')}
          ></TextArea>
        </Form.Item>
      </Form>
    </Modal>
  )
}
