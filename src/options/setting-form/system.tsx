import { Card, Form, Radio, Switch } from 'antd'
import i18next from 'i18next'
import { langs } from '../../common/langs'
import { Instructions } from './instructions'

export const SystemSetting: React.FC = () => {
  return (
    <Card title={i18next.t('System')} hoverable>
      <Form.Item label={i18next.t('Language')} name="lang">
        <Radio.Group>
          {langs.map((lang, index) => (
            <Radio.Button key={index} value={lang.value}>
              {lang.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label={i18next.t('Debug')}
        name="debug"
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        label={i18next.t('Custom instructions')}
        name="customInstructions"
      >
        <Instructions />
      </Form.Item>
    </Card>
  )
}
