import { AxiosRequestConfig } from "axios"

const backendBaseUrl = "http://localhost:8443"//"https://ty-breadish-backend.onrender.com"
const defaultAxiosRequestConfig: AxiosRequestConfig = {
    withCredentials: true
}

const commentsPageSize = 5

export {
    backendBaseUrl,
    defaultAxiosRequestConfig,
    commentsPageSize
}
