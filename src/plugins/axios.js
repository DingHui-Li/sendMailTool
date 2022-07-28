import axios from 'axios'

let config = {
  timeout: 60 * 1000,
  withCredentials: false
}

const instance = axios.create(config)

// instance.interceptors.request.use((config) => config, err => { })
// instance.interceptors.response.use((res) => res, err => { })

export default instance