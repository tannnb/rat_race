import { Form, Input, Button, Space, message,Typography } from 'antd'
import './index.css'
import { login } from '../interface'
import { useNavigate } from 'react-router-dom'

const {Link} = Typography
interface LoginUser {
  username: string
  password: string
}
export function Login() {
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
    const { username, password } = value
    const resp = await login(username, password)
    const { code, data } = resp.data
    console.log(resp.data)
    if (code === 200 || code === 201) {
      const data = resp.data.data

      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
      message.success('登录成功')
      setTimeout(() => {
        navigate('/')
      },1000)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }

  return (
    <div className="login-container">
      <h1>会议室预定系统</h1>
      <Form {...layout1} onFinish={onFinish} autoComplete="off" colon={false}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password></Input.Password>
        </Form.Item>

        <Form.Item {...layout2}>
          <Space>
            <Link href='/register'>创建账号</Link>
            <Link href='/update_password'>忘记密码</Link>
          </Space>
        </Form.Item>
        <Form.Item {...layout2}>
          <Button className="btn" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
