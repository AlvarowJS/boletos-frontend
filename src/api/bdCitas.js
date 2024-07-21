import axios from 'axios'

const bdCitas = axios.create({
    // baseURL: 'http://127.0.0.1:8000/api'
    baseURL: 'https://backend.tms2.nuvola7.com.mx/api'
})

export default bdCitas