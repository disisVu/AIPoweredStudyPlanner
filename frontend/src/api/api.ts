import axios from 'axios'

export const axiosPrivate = axios.create({
  baseURL: 'https://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
})
