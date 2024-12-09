import { AxiosRequestConfig } from "axios"

const backendBaseUrl = process.env.BACKEND_BASE_URL || "https://localhost:8443"
const defaultAxiosRequestConfig: AxiosRequestConfig = {
    withCredentials: true
}

const commentsPageSize = 5
const maptilerApiKey = "Xatct3p2XwOFw9GCQTYJ"

export {
    backendBaseUrl,
    defaultAxiosRequestConfig,
    commentsPageSize,
    maptilerApiKey
}
