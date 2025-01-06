import axios from 'axios'

export const axiosPrivate = axios.create({
  baseURL: 'https://aipoweredstudyplanner.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
})
