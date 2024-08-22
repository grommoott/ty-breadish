import { backendBaseUrl } from "@shared/config"
import { errorWrapper, ExError } from "@shared/helpers"
import { IUser, responseDataToUser } from "@shared/model/interfaces"
import { Email } from "@shared/model/types/primitives"
import axios from "axios"

async function createAccessToken(): Promise<void | ExError> {
    try {
        await axios.post(`${backendBaseUrl}/api/verificationCode/create`)
    } catch (e) {
        return errorWrapper(e, "createAccessToken")
    }
}

async function getAccessToken(): Promise<void | ExError> {
    try {
        await axios.get(`${backendBaseUrl}/api/accessToken`)
    } catch (e) {
        return errorWrapper(e, "getAccessToken")
    }
}

async function login(username: string, password: string): Promise<IUser | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/login`, {
            username, password
        })

        return responseDataToUser(response.data)
    } catch (e) {
        return errorWrapper(e, "postLogin")
    }
}

async function register(verificationCode: number, registerToken: string): Promise<IUser | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/register`, {
            verificationCode,
            registerToken
        })

        return responseDataToUser(response.data)
    } catch (e) {
        return errorWrapper(e, "postRegister")
    }
}

async function createRegisterToken(username: string, password: string, email: Email): Promise<string | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/register/token`, {
            username,
            password,
            email: email.email
        })

        return response.data.registerToken
    } catch (e) {
        return errorWrapper(e, "postRegisterToken")
    }
}

export { createAccessToken, getAccessToken, login, register, createRegisterToken }

