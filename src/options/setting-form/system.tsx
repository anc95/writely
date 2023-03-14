import { Card, Form, Radio, Switch } from 'antd';
import { langs } from '../../common/langs';
import { CustomList } from './custom-list';

export const SystemSetting: React.FC = () => {
  return (
    <Card title="System" hoverable>
      <Form.Item label="language" name="lang">
        <Radio.Group>
          {langs.map((lang) => (
            <Radio.Button value={lang.value}>{lang.label}</Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item label="debug" name="debug" valuePropName="checked">
        <Switch />
      </Form.Item>
      <Form.Item label="Custom instruction" name="customInstructions">
        <CustomList />
      </Form.Item>
    </Card>
  );
};
