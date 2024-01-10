


import { Button, Form, Input, message } from 'antd'
import './index.css'
import { Link, useNavigate } from 'react-router-dom'
import { getUserInfo, updateInfo, updateUserInfoCaptcha } from '../../interfaces'
import { useForm } from 'antd/es/form/Form'
import useCountdownTimer from '../../useHooks/useCaptcha'
import { useEffect } from 'react'
import HeadPicUpload from './HeadPicUpload'


const { Search } = Input
interface UpdateInfoDTO {
  avatar: string
  captcha: string
  nickName: string
  email: string
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const layoutButton = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

function UpdateInfo() {
  const [form] = useForm()
  const navigator = useNavigate()

  useEffect(() => {
    async function query() {
      const {code,data} = await getUserInfo()
      if(code === 200) {
        form.setFieldsValue({
          avatar: data.avatar,
          nickName: data.nickName,
          email: data.email,
        })
      }
    }
    query()
  },[])

  const { countdown, isCounting, startCountdown } = useCountdownTimer(60)

  const onFinish = async (value: UpdateInfoDTO) => {
    
     const { code, data } = await updateInfo(value)
    if (code === 200 && data) {
      message.success('用户信息更新成功')
    } else {
      message.error(data || '系统繁忙，请稍后再试!')
    }
  }

  const sendCaptcha = async () => {
    const { code, data } = await updateUserInfoCaptcha()
    if (code === 200) {
      message.success(data)
      startCountdown()
    } else {
      message.error('系统繁忙，请稍后再试!')
    }
  }

  return (
    <div className="login-container">
      <h1 className="title">会议预定系统</h1>
      <Form {...layout} form={form} colon={false} autoComplete="off" onFinish={onFinish}>
        <Form.Item
          label="头像"
          name="avatar"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <HeadPicUpload />
        </Form.Item>
        <Form.Item label="昵称" name="nickName" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input />
        </Form.Item>
        
        <Form.Item
          label="邮箱"
          
          name="email"
          rules={[
            { required: true, message: '请输入密码' },
            { type: 'email', message: '请输入合法邮箱地址!' },
          ]}
        >
          <Input disabled />
        </Form.Item>
        <div className="captcha-wrapper">
          <Form.Item
            className="captcha"
            label="验证码"
            name="captcha"
            rules={[{ required: true, message: '请输入验证码!' }]}
          >
            <Search
              placeholder="验证码"
              loading={Boolean(isCounting)}
              enterButton={isCounting ? `${countdown}S` : '发送验证码'}
              onSearch={sendCaptcha}
            />
          </Form.Item>
        </div>

     
        <Form.Item {...layoutButton}>
          <Button block type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdateInfo


