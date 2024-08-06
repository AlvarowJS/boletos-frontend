import axios from 'axios'

const bdBoletas = axios.create({
    baseURL: 'http://127.0.0.1:8000/api'
})

export default bdBoletas