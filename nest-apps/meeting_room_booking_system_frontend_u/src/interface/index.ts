import axios, { AxiosRequestConfig } from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 3000
})

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken
  }
  return config
})

interface PendTask {
  config: AxiosRequestConfig,
  resolve: Function
}
let refreshing = false
const queue: PendTask[] = []
axios.interceptors.response.use(
  response => response,
  async error => {
    const { data, config } = error.response
    if (refreshing) {
      return new Promise(resolve => queue.push({ config, resolve }))
    }
    if (data.code === 401 && !config.url.includes('/user/refresh')) {
      refreshing = true
      const res = await refreshToken()
      refreshing = false;
      if(res.status === 200) {
        queue.forEach(({config,resolve}) => {
          resolve(axiosInstance(config))
        })
        return axiosInstance(config)
      }else {
        // 提示信息
        setTimeout(() => {
          window.location.href = '/login'
        },1500)
      }
    }else {
      return error.response
    }
  }
)


async function refreshToken() {
  const res = await axiosInstance.get('/user/refresh',{
    params:{
      refresh_token: localStorage.getItem('refresh_token')
    }
  })
  localStorage.setItem('access_token', res.data.accesstToken || '')
  localStorage.setItem('refresh_token', res.data.refreshToken || '')
  return res
}

export async function login(username: string, password: string) {
  return await axiosInstance.post('/user/login', {
    username,
    password
  })
}

export async function registerCaptcha(email: string) {
  return await axiosInstance.get('/user/register-captcha', {
    params: { address: email }
  })
}

interface RegisterUser {
  username: string;
  nickName?: string;
  password: string,
  email: string;
  captcha: string
}
export async function register(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/reigster', registerUser)
}


export async function updatePassCaptcha(email: string) {
  return await axiosInstance.get('/user/update_password/captcha', {
    params: { address: email }
  })
}

export async function updatePassword(registerUser: RegisterUser) {
  return await axiosInstance.post('/user/update_password', registerUser)
}
