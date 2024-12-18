import axios from 'axios'

export const axiosPrivate = axios.create({
  baseURL: 'https://aipoweredstudyplanner-be.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
})
