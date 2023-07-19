import { remove, setTopPinned } from '@/common/api/instructions'
import { useSettings } from '@/common/store/settings'
import { IconBtn } from '@/components/icon-btn'
import { IcBaselineDeleteOutline } from '@/components/icon/delete'
import { MaterialSymbolsEditOutline } from '@/components/icon/edit'
import { MaterialSymbolsArrowUpward } from '@/components/icon/up'
import { Instruction } from '@/options/types'
import { Popconfirm, Popover, Table, TableProps, Typography } from 'antd'
import i18next from 'i18next'
import { useModalState } from './modal-state'

const { Paragraph } = Typography

export const List: React.FC<{ value: Instruction[] }> = ({ value }) => {
  const columns = useColumns()

  return <Table columns={columns} dataSource={value} rowKey={'id'} />
}

const useColumns = () => {
  const { refresh } = useSettings()
  const { setIsOpen, setEditTarget } = useModalState()

  const columns: TableProps<Instruction>['columns'] = [
    {
      title: i18next.t('Icon'),
      dataIndex: 'icon',
    },
    {
      title: i18next.t('Name'),
      dataIndex: 'name',
      width: 200,
      render: (value) => {
        return (
          <Paragraph className="w-48" ellipsis>
            {value}
          </Paragraph>
        )
      },
    },
    {
      title: i18next.t('Instruction'),
      dataIndex: 'instruction',
      width: 200,
      render: (value) => {
        return (
          <Paragraph
            className="w-48"
            ellipsis={{ expandable: true, symbol: 'more' }}
          >
            {value}
          </Paragraph>
        )
      },
    },
    {
      title: i18next.t('Actions'),
      render: (_, record) => {
        return (
          <div className="flex gap-1">
            <Popconfirm
              title={i18next.t('Delete instruction')}
              okText={i18next.t('Ok')}
              onConfirm={async () => {
                await remove(record.id)
                await refresh()
              }}
            >
              <IconBtn color="red">
                <IcBaselineDeleteOutline />
              </IconBtn>
            </Popconfirm>
            <IconBtn
              onClick={() => {
                setIsOpen(true)
                setEditTarget(record)
              }}
            >
              <MaterialSymbolsEditOutline />
            </IconBtn>
            <Popover content={i18next.t('Top pinned')} trigger="hover">
              <IconBtn
                onClick={async () => {
                  await setTopPinned(record.id)
                  await refresh()
                }}
              >
                <MaterialSymbolsArrowUpward />
              </IconBtn>
            </Popover>
          </div>
        )
      },
    },
  ]

  return columns
}
