import axios from 'axios'

const bdBoletas = axios.create({
    baseURL: 'https://boletos.tms2.nuvola7.com.mx/api'
})

export default bdBoletas