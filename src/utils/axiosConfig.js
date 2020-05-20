import axios from 'axios'
const instance = axios.create({
  baseURL: 'https://sandbox-transactions-api.getsimpl.com/api/v4',
})

instance.defaults.headers.common.Authorization = process.env.SIMPL_CLIENT_SECRET

export default instance
