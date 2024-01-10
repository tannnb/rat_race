import { Button, Form, Input, message } from 'antd'
import './update_password.css'
import { useNavigate } from 'react-router-dom'
import { updatePasswordCaptcha, updatePassword, getUserInfo } from '../../interfaces'
import { useForm } from 'antd/es/form/Form'

import useCountdownTimer from '../../useHooks/useCaptcha'
import { useEffect, useState } from 'react'

const { Search } = Input

interface updatePasswordDTO {
  username: string
  password: string
  captcha: string
  confirmPassword: string
  email: string
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
const layoutButton = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

function UpdatePassword() {
  const [form] = useForm()
  const navigator = useNavigate()
  const [userInfo, setUserInfo] = useState<Record<string, any>>()

  const { countdown, isCounting, startCountdown } = useCountdownTimer(60)

  useEffect(() => {
    async function query() {
      const { code, data } = await getUserInfo()
      if (code === 200) {
        form.setFieldsValue({
          email: data.email
        })
        setUserInfo(data)
      }
    }
    query()
  }, [])

  const onFinish = async (value: updatePasswordDTO) => {
    if (value.password !== value.confirmPassword) {
      return message.error('两次密码不一致')
    }

    const { code, data } = await updatePassword({ ...value, username: userInfo?.username })
    if (code === 200 && data) {
      message.success('修改成功')
      setTimeout(() => navigator('/login'), 1500)
    } else {
      message.error(data || '系统繁忙，请稍后再试!')
    }
  }

  const sendCaptcha = async () => {
    const address = form.getFieldValue('email')
    if (!address) {
      return message.error('请输入邮箱地址')
    }
    const { code, data } = await updatePasswordCaptcha(address)
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
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入密码' },
            { type: 'email', message: '请输入合法邮箱地址!' },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
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
            立即修改
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default UpdatePassword
