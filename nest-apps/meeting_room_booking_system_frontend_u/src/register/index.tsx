import { Form, Input, Button, Space, message, Typography } from 'antd'
import './index.css'
import {  register, registerCaptcha } from '../interface'
import { useForm } from 'antd/es/form/Form'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

const { Link } = Typography
interface LoginUser {
  username: string
  nickName: string
  password: string
  email: string
  confirmPassword: string
  captcha: string
}
export function Register() {
  const [form] = useForm()
  const navigate = useNavigate()
  const layout1 = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  }
  const layout2 = {
    labelCol: { span: 40 },
    wrapperCol: { span: 24 },
  }
  const onFinish = async (value: LoginUser) => {
    const { password, confirmPassword } = value
    if (password !== confirmPassword) {
      return message.error('两次密码不一致')
    }

    const resp = await register(value)
    const { code, data } = resp.data
    console.log(resp.data)
    if (code === 200 || code === 201) {
      message.success('注册成功')
      setTimeout(() => {
        navigate('/login')
      },1500)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }

  const sendCaptcha = useCallback(async () => {
    const address = form.getFieldValue('email')
    if (!address) {
      return message.error('请输入邮箱地址')
    }
    const resp = await registerCaptcha(address)
    const { code, data } = resp.data
    if (code === 200 || code === 201) {
      message.success(data)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }, [])

  return (
    <div className="register-container">
      <h1>会议室预定系统</h1>
      <Form form={form} {...layout1} onFinish={onFinish} autoComplete="off" colon={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="昵称" name="nickName" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="确认密码"
          name="confirmPassword"
          rules={[{ required: true, message: '请确认密码' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入合法邮箱地址' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="验证码"
          name="captcha"
          rules={[{ required: true, message: '请输入验证码' }]}
        >
          <Space.Compact style={{ width: '100%' }}>
            <Input />
            <Button type="primary" onClick={sendCaptcha}>
              发送验证码
            </Button>
          </Space.Compact>
        </Form.Item>

        <Form.Item {...layout2}>
          <Link>已有账号? 去登录</Link>
        </Form.Item>
        <Form.Item {...layout1} label="">
          <Button className="btn" type="primary" htmlType="submit">
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
