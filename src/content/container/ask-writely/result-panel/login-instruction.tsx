import { openOptionPage } from '@/common/browser'
import Link from 'antd/es/typography/Link'
import i18next from 'i18next'

export const LoginInstruction: React.FC = () => {
  return (
    <div className="p-3 bg-zinc-100">
      <span>
        {i18next.t('No Writely account detected')}, {i18next.t('please Go to')}{' '}
      </span>
      <Link onClick={openOptionPage}>{i18next.t('Extension Settings')}</Link>
      <span> {i18next.t('to connect')}</span>
    </div>
  )
}
