import { Form, Input, Select } from 'antd';
import { useModels } from '../../common/api/openai';
import { Block } from './block';

export const OPENAISettings: React.FC = () => {
  const { data, isLoading } = useModels();

  return (
    <div className="w-[800px]">
      <Block>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item name="apiKey" label="OpenAI API Key" required>
            <Input />
          </Form.Item>
          <Form.Item name="model" label="Model">
            <Select loading={isLoading}>
              {data?.map((model) => (
                <Select.Option key={model.id} value={model.id}>
                  {model.id}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </Block>
    </div>
  );
};
