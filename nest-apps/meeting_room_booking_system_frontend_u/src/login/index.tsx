import { message, Typography } from 'antd'
import { login } from '../interface'
import { useNavigate } from 'react-router-dom'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { LoginForm, ProConfigProvider, ProFormText } from '@ant-design/pro-components'
const { Link } = Typography
interface LoginUser {
  username: string
  password: string
}
export function Login() {
  const navigate = useNavigate()

  const onFinish = async (value: LoginUser) => {
    const { username, password } = value
    const resp = await login(username, password)
    const { code, data } = resp.data

    if (code === 200 || code === 201) {
      const data = resp.data.data
      localStorage.setItem('access_token', data.accessToken)
      localStorage.setItem('refresh_token', data.refreshToken)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
      message.success('登录成功')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          logo="https://github.githubassets.com/images/modules/logos_page/Octocat.png"
          title="Meeting booking"
          subTitle="会议预定系统"
          onFinish={onFinish}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined className={'prefixIcon'} />,
            }}
            placeholder={'用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined className={'prefixIcon'} />,
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <div style={{ marginBlockEnd: 24, display: 'flex', justifyContent: 'space-between' }}>
            <Link href="/register">创建账号</Link>
            <Link href="/update_password">忘记密码</Link>
          </div>
        </LoginForm>
      </div>
    </ProConfigProvider>
  )
}
