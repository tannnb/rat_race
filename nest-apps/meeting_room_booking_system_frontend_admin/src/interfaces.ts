import { message } from 'antd';
import axios, { AxiosRequestConfig } from 'axios'


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 6000
})

interface PendingTask {
  config: AxiosRequestConfig
  resolve: Function
}
let refreshing = false;
const queue: PendingTask[] = []

axiosInstance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('access_token')
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`
    }
    return config
  }
)

axiosInstance.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      localStorage.clear()
      setTimeout(() => window.location.href = '/login', 1500)
    }
    return response
  },
  async error => {
    if (!error.response) {
      return Promise.reject(error)
    }
    let { data, config } = error.response
    if (refreshing) {
      return new Promise((resolve) => {
        queue.push({
          config,
          resolve
        })
      })
    }
    if (data.code === 401 && !config.url.includes('/user/admin/refresh')) {
      refreshing = true
      const resp = await refreshToken()
      refreshing = false
      if (resp.status === 200) {
        queue.forEach(({ config, resolve }) => resolve(config))
        return axiosInstance(config)
      } else {
        message.error(resp.data)
        setTimeout(() => window.location.href = '/login', 1500)
      }
    } else {
      return error.response
    }
  }
)


async function refreshToken() {
  const resp = await axiosInstance.get('/user/refresh', {
    params: {
      refresh_token: localStorage.getItem('refresh_token')
    }
  })
  localStorage.setItem('access_token', resp.data.access_token || '')
  localStorage.setItem('refresh_token', resp.data.refresh_token || '')
  return resp
}




type LoginDTO = {
  username: string,
  password: string
}
export async function login(params: LoginDTO) {
  const response = await axiosInstance.post('/user/admin/login', {
    username: params.username,
    password: params.password
  })
  return response.data
}


interface UserParams {
  username: string
  nickName: string
  email: string
  pageSize: number
  pageNo: number
}
export async function findUserList(params: UserParams) {
  const response = await axiosInstance.get('/user/list', {
    params
  })
  return response.data
}


export async function freezeUser(id: string) {
  const response = await axiosInstance.get('/user/freeze', {
    params: {
      id
    }
  })
  return response.data
}




export async function registerCaptcha(address: string) {
  const response = await axiosInstance.get('/user/register-captcha', {
    params: {
      address
    }
  })
  return response.data
}

interface registerDTO {
  username: string
  password: string
  captcha: string
  nickName: string
  email: string
}

export async function registerUser(registerUser: registerDTO) {
  const response = await axiosInstance.post('/user/reigster', registerUser)
  return response.data
}



export async function updatePasswordCaptcha(email: string) {
  const response = await axiosInstance.get('/user/update_password/captcha', {
    params: {
      address: email
    }
  })
  return response.data
}

interface updatePasswordDTO {
  username: string
  password: string
  captcha: string
  email: string
}
export async function updatePassword(data: updatePasswordDTO) {
  const response = await axiosInstance.post('/user/admin/update_password', data);
  return response.data
}


export async function getUserInfo() {
  const response = await axiosInstance.get('/user/info')
  return response.data
}
interface UpdateInfoDTO {
  avatar: string
  captcha: string
  nickName: string
  email: string
}
export async function updateInfo(data: UpdateInfoDTO) {
  const response = await axiosInstance.post('/user/update', data)
  return response.data
}
export async function updateAdminInfo(data: UpdateInfoDTO) {
  const response = await axiosInstance.post('/user/admin/update', data)
  return response.data
}
export async function updateUserInfoCaptcha() {
  const response = await axiosInstance.get('/user/update/captcha')
  return response.data
}



interface RoomList {
  pageSize: number
  pageNo: number
  name: string
  capacity: number
  isBooked: boolean
}

export async function findMeetingRoomList(params: RoomList) {
  const response = await axiosInstance.get('/meeting-room/list', {
    params
  })
  return response.data
}




export interface CreateRoom {
  id?:number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description?: string;
}
export async function createMeeting(data: CreateRoom) {
  const response = await axiosInstance.post(`/meeting-room/create`,data)
  return response.data
}
export async function updateMeeting(data: CreateRoom) {
  const response = await axiosInstance.post(`/meeting-room/update`,data)
  return response.data
}

export async function deleteMeetingById(id: number) {
  const response = await axiosInstance.post(`/meeting-room/${id}`)
  return response.data
}
