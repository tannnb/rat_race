import { App, message, Typography } from 'antd'
import './index.css'
import { register, registerCaptcha } from '../interface'
import { useForm } from 'antd/es/form/Form'
import { useNavigate } from 'react-router-dom'
import { ProForm, ProFormCaptcha, ProFormText } from '@ant-design/pro-components'
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

  const onFinish = async (value: LoginUser) => {
    const { password, confirmPassword } = value

    if (password !== confirmPassword) {
      return message.error('两次密码不一致')
    }

    const resp = await register(value)
    const { code, data } = resp.data
    if (code === 200 || code === 201) {
      message.success('注册成功')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }

  const sendCaptcha = async () => {
    const address = form.getFieldValue('email')
    const resp = await registerCaptcha(address)
    const { code, data } = resp.data
    if (code === 200 || code === 201) {
      message.success(data)
    } else {
      message.error(data || '系统繁忙，请稍后再试')
    }
  }

  return (
    <App>
      <div className="register-container">
        <ProForm
          form={form}
          layout={'horizontal'}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          submitter={{
            submitButtonProps: {
              style: {
                width: '100%',
                display: 'block',
              },
            },
            resetButtonProps: false,
          }}
          onFinish={onFinish}
        >
          <ProFormText
            label="用户名"
            name="username"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'用户名'}
            rules={[{ required: true, message: '请输入用户名!' }]}
          />
          <ProFormText
            label="昵称"
            name="nickName"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'昵称'}
            rules={[{ required: true, message: '请输入昵称!' }]}
          />
          <ProFormText.Password
            label="密码"
            name="password"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <ProFormText.Password
            label="确认密码"
            name="confirmPassword"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'确认密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />

          <ProFormCaptcha
            label="邮箱地址"
            fieldProps={{
              size: 'large',
            }}
            captchaProps={{
              size: 'large',
            }}
            phoneName="email"
            placeholder={'请输入邮箱地址'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'获取验证码'}`
              }
              return '获取验证码'
            }}
            name="email"
            rules={[
              {
                required: true,
                message: '请输入邮箱地址！',
              },
              {
                pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                message: '邮箱格式不正确',
              },
            ]}
            onGetCaptcha={async () => sendCaptcha()}
          />

          <ProFormText
            label="验证码"
            name="captcha"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'验证码'}
            rules={[{ required: true, message: '请输入验证码!' }]}
          />

          <div style={{ marginBlockEnd: 24 }}>
            <Link href="/login">已有账号? 去登录</Link>
          </div>
        </ProForm>
      </div>
    </App>
  )
}
