import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components'
import {  useRef, useState } from 'react'
import {
  findMeetingRoomList,
} from '../../interfaces'
import { ModalForm, ProForm, ProFormText, ProFormDigit } from '@ant-design/pro-components'
import { Button, Popconfirm, Form, Typography, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

const { Link } = Typography
interface UserSearchResult {
  id: number
  name: string
  capacity: string
  location: string
  description: string
  isBooked: boolean
}

const MeetingRoomList: React.FC = () => {
  const actionRef = useRef<ActionType>()
  const [form] = Form.useForm<any>()
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const columns: ProColumns<UserSearchResult>[] = [
    {
      title: '会议室名称',
      dataIndex: 'name',
    },
    {
      title: '容纳人数',
      dataIndex: 'capacity',
      search: false,
    },
    {
      title: '会议室位置',
      dataIndex: 'location',
      search: false,
    },
    {
      title: '设备',
      dataIndex: 'equipment',
      search: false,
    },
    {
      title: '描述',
      dataIndex: 'description',
      search: false,
    },
    {
      title: '预定状态',
      dataIndex: 'isBooked',
      valueEnum: {
        true: {
          text: '已预定',
          status: 'Error',
        },
        false: {
          text: '空闲',
          status: 'Success',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        return (
          <Popconfirm
              title="是否预定该会议室"
              onConfirm={() => handleReserveRoom(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Link>预 订</Link>
            </Popconfirm>
        )
      },
    },
  ]
  const handleEdit = (values: UserSearchResult) => {
    setModalVisible(true)
    form?.setFieldsValue({...values} as any)
  }

  const handleReserveRoom = async (id: number) => {
    // const { code, data } = await deleteMeetingById(id)
    // if (code === 200) {
    //   message.success('删除成功')
    //   actionRef.current?.reload()
    // } else {
    //   message.error(data || '系统繁忙，请稍后再试')
    // }
  }

  return (
    <>
      <ProTable<UserSearchResult>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowKey="id"
        request={async (params, sort, filter) => {
          const { data } = await findMeetingRoomList({
            pageSize: params.pageSize || 10,
            pageNo: params.current || 1,
            name: params.name,
            capacity: params.capacity,
            isBooked: params.isBooked,
          })
          return {
            data: data?.meetingRooms || [],
            success: true,
            total: data?.totalCount || 0,
          }
        }}
        toolBarRender={() => [
          <ModalForm
            title="新建会议室"
            open={modalVisible}
            trigger={
              <Button type="primary">
                <PlusOutlined />
                新建
              </Button>
            }
            form={form}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
            }}
            submitTimeout={2000}
            onOpenChange={setModalVisible}
            onFinish={async (values) => {
              const id = form.getFieldValue('id') || ''
              // const fetchType = id ? updateMeeting: createMeeting
              // const { code, data } = await fetchType({...values,id })
              // if (code === 200) {
              //   message.success('操作成功')
              //   actionRef.current?.reload()
              //   return true
              // }
              // message.error(data)
              return false
            }}
          >
            <ProForm.Group>
              <ProFormText
                rules={[{ required: true, message: '必填项' }]}
                width="md"
                name="name"
                label="会议室名称"
              />
              <ProFormText
                rules={[{ required: true, message: '必填项' }]}
                width="md"
                name="location"
                label="位置"
              />
            </ProForm.Group>
            <ProForm.Group>
              <ProFormDigit
                rules={[{ required: true, message: '必填项' }]}
                width="md"
                min={1}
                max={100}
                name="capacity"
                label="容纳人数"
              />
              <ProFormText
                rules={[{ required: true, message: '必填项' }]}
                width="md"
                name="equipment"
                label="设备"
              />
            </ProForm.Group>
            <ProFormText name="description" label="描述" />
          </ModalForm>,
        ]}
      />
    </>
  )
}

export default MeetingRoomList
