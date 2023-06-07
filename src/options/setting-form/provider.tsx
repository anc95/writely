import { OpenAILogo } from '@/components/icon/open-ai'
import { IconWritely } from '@/components/icon/writely'
import { Card, Form, Popover, Radio, Spin, Tooltip } from 'antd'
import i18next from 'i18next'
import { ServiceProvider } from '../types'
import classNames from 'classnames'
import { MaterialSymbolsAddLink } from '@/components/icon/link'
import { useUser } from '@/common/api/writely'
import Link from 'antd/es/typography/Link'
import { MaterialSymbolsCheckCircleRounded } from '@/components/icon/checked'

export const ProviderSetting: React.FC = () => {
  const value = Form.useWatch('serviceProvider')
  const activeClassNames = 'bg-black text-white'

  const isCheckedWritely = value === ServiceProvider.Writely
  const isCheckedOpenAI = value === ServiceProvider.OpenAI

  return (
    <Card title={i18next.t('Service Provider')} hoverable>
      <Form.Item name="serviceProvider">
        <div>
          <Radio.Group
            className="flex justify-center w-full"
            onChange={(e) => console.log(e.target.value)}
          >
            <Radio value={ServiceProvider.Writely}>
              <Tooltip
                title={i18next.t(
                  'Using the services provided by Writely, there are 10 free times per day'
                )}
              >
                <div
                  style={{
                    boxShadow: isCheckedWritely
                      ? '0px 3px rgb(252,211,77)'
                      : '',
                  }}
                  className={classNames(
                    'flex gap-2 justify-center items-center py-3 px-5 rounded-full',
                    isCheckedWritely ? activeClassNames : ''
                  )}
                >
                  <IconWritely className="h-11" />
                  <span className="font-semibold text-3xl">Writely</span>
                </div>
              </Tooltip>
            </Radio>
            <Radio value={ServiceProvider.OpenAI}>
              <Tooltip
                title={i18next.t(
                  'By using the services provided by OpenAI API Key, you can permanently use Writely software for free'
                )}
              >
                <div
                  style={{
                    boxShadow: isCheckedOpenAI ? '0px 3px rgb(252,211,77)' : '',
                  }}
                  className={classNames(
                    'items-center py-3 px-5 rounded-full',
                    isCheckedOpenAI ? activeClassNames : ''
                  )}
                >
                  <OpenAILogo className="h-11 w-auto" />
                </div>
              </Tooltip>
            </Radio>
          </Radio.Group>
        </div>
      </Form.Item>
      {isCheckedWritely ? <LinkToWritelySite /> : null}
    </Card>
  )
}

const LinkToWritelySite: React.FC = () => {
  const { isLoading, data } = useUser()
  const email = data?.data?.user?.email

  return (
    <div className="flex py-4 border-border border-t text-xl gap-3 items-center justify-center">
      {isLoading ? (
        <Spin spinning />
      ) : email ? (
        <div className="flex gap-1 items-center">
          <Link
            target="_blank"
            href="https://writely.miao-ya.com"
            className="text-lg"
          >
            {data?.data?.user?.email}
          </Link>
          <span className="text-green-500">
            <MaterialSymbolsCheckCircleRounded />
          </span>
        </div>
      ) : (
        <>
          <span>{i18next.t('Connect your writely account')}</span>
          <a
            target="_blank"
            href="https://writely.miao-ya.com"
            className="text-blue-500 text-3xl"
          >
            <MaterialSymbolsAddLink />
          </a>
        </>
      )}
    </div>
  )
}
