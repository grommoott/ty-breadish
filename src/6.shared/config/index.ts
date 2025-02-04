import { AxiosRequestConfig } from "axios"

const backendBaseUrl = "https://ty-breadish-backend.onrender.com"//"https://localhost:8443"
const defaultAxiosRequestConfig: AxiosRequestConfig = {
    withCredentials: true
}

const commentsPageSize = 5

export {
    backendBaseUrl,
    defaultAxiosRequestConfig,
    commentsPageSize,
}
