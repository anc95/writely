import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Select,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useCallback, useState } from 'react';
import { useModels, useOpenAIEditPrompt } from '../../common/api/openai';
import cx from 'classnames';

export const OPENAISettings: React.FC = () => {
  const models = useModels();

  return (
    <Card title="Open AI" hoverable>
      <Form.Item
        className="col-span-5"
        name="apiKey"
        label="OpenAI API Key"
        required
      >
        <Input.Password />
      </Form.Item>
      <Form.Item className="col-span-5" name="model" label="Model">
        {/* <Select>
          {models.map((model) => (
            <Select.Option key={model.id} value={model.id}>
              {model.id} {model.price}
            </Select.Option>
          ))}
        </Select> */}
        <Radio.Group className="grid grid-cols-3 gap-4">
          {models.map((m) => (
            <Radio value={m.id}>
              <ModelCard {...m} />
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="Url" name="url">
        <Input />
      </Form.Item>
      <ConnectionTest />
    </Card>
  );
};

const ConnectionTest: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const queryOpenAIEdit = useOpenAIEditPrompt();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('hello');

  const handleOk = useCallback(async () => {
    setLoading(true);
    setResult('');

    try {
      queryOpenAIEdit(message, 'test', (text, err) => {
        setResult(text);
        setLoading(false);

        if (err) {
          setResult(err.message);
        }
      });
    } catch (e) {
      setResult(e.toString());
    } finally {
      setLoading(false);
    }
  }, [queryOpenAIEdit]);

  return (
    <div>
      <Button onClick={() => setModalVisible(true)} type="primary">
        Test
      </Button>
      <Modal
        open={modalVisible}
        okText="Send message"
        onCancel={() => setModalVisible(false)}
        title="Test connection"
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
  );
};

const ModelCard: React.FC<{
  id: string;
  price: string;
  description: string;
}> = ({ id, price, description }) => {
  const model = Form.useWatch('model');

  return (
    <Tooltip title={description}>
      <div
        className={cx(
          'border border-gray-100 hover:shadow-md rounded-sm transition-all duration-300 p-3',
          model === id ? '!border-black' : ''
        )}
      >
        <div>
          <a>{id}</a>
          <Tag color="gold-inverse">{price}</Tag>
        </div>
      </div>
    </Tooltip>
  );
};
