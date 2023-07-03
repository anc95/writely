import { openOptionPage } from '@/common/browser'
import Link from 'antd/es/typography/Link'
import i18next from 'i18next'

export const LoginInstruction: React.FC<{
  accountType: 'Writely' | 'ChatGPT'
}> = ({ accountType }) => {
  return (
    <div className="p-3 bg-zinc-100">
      <span>
        {i18next
          .t('No Writely account detected')
          .replace('Writely', accountType || 'Writely')}
        , {i18next.t('please Go to')}{' '}
      </span>
      <Link onClick={openOptionPage}>{i18next.t('Extension Settings')}</Link>
      <span> {i18next.t('to connect')}</span>
    </div>
  )
}
