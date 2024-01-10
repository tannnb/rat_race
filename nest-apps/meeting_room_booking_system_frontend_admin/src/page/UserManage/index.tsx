import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import { useRef } from 'react'
import { findUserList, freezeUser } from '../../interfaces'
import { Image, message } from 'antd'
import dayjs from 'dayjs'

interface UserSearchResult {
  id: string
  username: string
  nickname: string
  email: string
  avatar: string
  createTime: Date
  isFrozen: boolean
}

const UserManage: React.FC = () => {
  const actionRef = useRef<ActionType>()

  const columns: ProColumns<UserSearchResult>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      search: false,
      render: (value, record) => {
        return value ? <Image width={50} src={`http://localhost:3000/${value}`} /> : ''
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '状态',
      dataIndex: 'isFrozen',
      search: false,
      valueEnum: {
        true: {
          text: '已冻结',
          status: 'Error',
        },
        false: {
          text: '正常',
          status: 'Success',
        },
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      search: false,
      render: (value) => {
        if ((value && typeof value === 'string') || typeof value === 'number') {
          const parsedDate = dayjs(value).format('YYYY-MM-DD HH:mm:ss')
          return parsedDate
        }
        return ''
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        return <a onClick={() => handleFreezeUser(record)}>
          {
            record.isFrozen ? '解冻' : '冻结'
          }
        </a>
      },
    },
  ]

  const handleFreezeUser = async ({ id, isFrozen }: { id: string; isFrozen: boolean }) => {
    const { code,data } = await freezeUser(id)
    const text = isFrozen ? '解冻' : '冻结'
    if (code === 200) {
      message.success(`账号已${text}`)
      actionRef.current?.reload();
    }else {
      message.error(data || '系统繁忙，请稍后再试');
    }
  }

  return (
    <ProTable<UserSearchResult>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      rowKey="id"
      request={async (params, sort, filter) => {
        const { data } = await findUserList({
          pageSize: params.pageSize || 10,
          pageNo: params.current || 1,
          username: params.username,
          nickName: params.nickName,
          email: params.email,
        })

        return {
          data: data?.users || [],
          success: true,
          total: data?.totalCount || 0,
        }
      }}
    />
  )
}

export default UserManage
