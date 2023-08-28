import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 3000
})

export async function login(username:string,password:string) {
  return await axiosInstance.post('/user/login',{
    username,
    password
  })
}

export async function registerCaptcha(email:string) {
  return await axiosInstance.get('/user/register-captcha',{
    params:{address: email}
  })
}

interface RegisterUser {
  username:string;
  nickName:string;
  password:string,
  email:string;
  captcha:string
}
export async function register(registerUser:RegisterUser) {
  return await axiosInstance.post('/user/reigster',registerUser)
}
