import {
  Button,
  Card,
  Form,
  Input,
  message,
  Modal,
  Select,
  Tooltip,
  Typography,
} from 'antd';
import { useCallback, useState } from 'react';
import { useModels, useQueryOpenAIPrompt } from '../../common/api/openai';
import { Block } from './block';

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
        <Select>
          {models.map((model) => (
            <Select.Option key={model.id} value={model.id}>
              {model.id} {model.price}
            </Select.Option>
          ))}
        </Select>
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
  const queryOpenAI = useQueryOpenAIPrompt();
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string>('');
  const [message, setMessage] = useState<string>('hello');

  const handleOk = useCallback(async () => {
    setLoading(true);
    setResult('');

    try {
      queryOpenAI(message, (text, err) => {
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
  }, [queryOpenAI]);

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
