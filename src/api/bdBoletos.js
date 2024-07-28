import axios from 'axios'

const bdBoletas = axios.create({
    baseURL: 'http://boletos.tms2.nuvola7.com.mx/api'
})

export default bdBoletas