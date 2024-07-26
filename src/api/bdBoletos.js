import axios from 'axios'

const bdBoletas = axios.create({
    baseURL: 'https://backend.boletos.nuvola7.com.mx/api'
})

export default bdBoletas