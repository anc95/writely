import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Tag,
  Tooltip,
  Typography,
} from 'antd'
import { useCallback, useState } from 'react'
import { useModels, useOpenAIEditPrompt } from '../../common/api/openai'
import cx from 'classnames'
import i18next from 'i18next'
import { ServiceProvider } from '../types'

export const OPENAISettings: React.FC = () => {
  const models = useModels()
  const value = Form.useWatch('serviceProvider')

  if (value !== ServiceProvider.OpenAI) {
    return null
  }

  return (
    <Card title="Open AI" hoverable>
      <Form.Item
        className="col-span-5"
        name="apiKey"
        label={i18next.t('OpenAI API Key')}
        required
        tooltip={
          <div>
            Don't know or don't have one? reach{' '}
            <a
              className="text-blue-300"
              href="https://platform.openai.com/account/api-keys"
            >
              here
            </a>{' '}
            for more details
          </div>
        }
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        className="col-span-5"
        name="model"
        label={i18next.t('Model')}
        required
        requiredMark
        tooltip={
          <a
            className="text-blue-300"
            href="https://platform.openai.com/docs/models/overview"
          >
            {i18next.t('Models Introduction')}
          </a>
        }
      >
        <Radio.Group className="flex flex-wrap gap-4">
          {models.map((m) => (
            <Radio key={m.id} className="" value={m.id}>
              <ModelCard {...m} />
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        className="col-span-5"
        name="temperature"
        label={i18next.t('Temperature')}
        required
        requiredMark
        tooltip={
          <a
            className="text-blue-300"
            href="https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature"
          >
            {i18next.t('Temperature Introduction')}
          </a>
        }
      >
        <Radio.Group defaultValue="1">
          <Tooltip title="0">
            <Radio.Button value="0">{i18next.t('accurate')}</Radio.Button>
          </Tooltip>
          <Tooltip title="0.7">
            <Radio.Button value="0.7">{i18next.t('balance')}</Radio.Button>
          </Tooltip>
          <Tooltip title="1">
            <Radio.Button value="1">{i18next.t('creative')}</Radio.Button>
          </Tooltip>
        </Radio.Group>
      </Form.Item>
      <Form.Item label={i18next.t('URL')} name="url" required>
        <Input placeholder="https://api.openai.com/v1" />
      </Form.Item>
      <ConnectionTest />
    </Card>
  )
}

const ConnectionTest: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const queryOpenAIEdit = useOpenAIEditPrompt()
  const [loading, setLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [message, setMessage] = useState<string>('hello')

  const handleOk = useCallback(async () => {
    setLoading(true)
    setResult('')

    try {
      await queryOpenAIEdit(message, 'test', (text, err, end) => {
        setResult(text)

        if (err) {
          setLoading(false)
          setResult(err.message)
        }

        if (end) {
          setLoading(false)
        }
      })
    } catch (e) {
      setResult(e.toString())
      setLoading(false)
    }
  }, [queryOpenAIEdit])

  return (
    <div>
      <Button onClick={() => setModalVisible(true)} type="primary">
        {i18next.t('Test')}
      </Button>
      <Modal
        open={modalVisible}
        okText={i18next.t('Send message')}
        cancelText={i18next.t('Cancel')}
        onCancel={() => setModalVisible(false)}
        title={i18next.t('Test connection')}
        onOk={handleOk}
        okButtonProps={{ loading }}
      >
        <Input.TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></Input.TextArea>
        <Typography>{result}</Typography>
      </Modal>
    </div>
  )
}

const ModelCard: React.FC<{
  id: string
  price: string
  description: string
}> = ({ id, price, description }) => {
  const model = Form.useWatch('model')

  return (
    <Tooltip title={description}>
      <div
        className={cx(
          'border border-gray-100 hover:rounded-lg rounded-md hover:shadow-sm transition-all duration-300 p-3  bg-zinc-100 flex flex-col gap-2',
          model === id ? '!border-black' : ''
        )}
      >
        <div className="font-semibold text-sm">{id}</div>
        <Tag className="!text-xs" color="gold-inverse">
          {price}
        </Tag>
      </div>
    </Tooltip>
  )
}
