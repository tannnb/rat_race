import { Button, Form, Input,  message } from 'antd'
import './login.css'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../../interfaces'

interface LoginUser {
  username: string
  password: string
}

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const layoutButton = {
  labelCol: { span: 0 },
  wrapperCol: { span: 24 },
}

function Login() {
  const navigator = useNavigate()
  const onFinish = async (value: LoginUser) => {
  
    const {code,data} = await login(value)
    if(code === 200 && data) {
      message.success('登录成功')
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
      setTimeout(() => navigator('/'), 1000)
    } else {
      message.error(data || '系统繁忙，请稍后再试!')
    }
  }

  return (
    <div className="login-container">
      <h1 className="title">会议预定系统</h1>
      <Form {...layout} colon={false} autoComplete="off" onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item {...layoutButton}>
          <Button block type="primary" htmlType="submit">
            登 录
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login
