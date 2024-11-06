import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { OwnedUser } from "@shared/facades";
import { errorWrapper, ExError } from "@shared/helpers";
import { IUser } from "@shared/model/interfaces";
import { Email, UserId } from "@shared/model/types/primitives";
import axios from "axios";

async function isUsernameAvailable(username: string): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/usernameAvailable/${btoa(username)}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isUsernameAvailable")
    }
}

async function isEmailAvailable(email: Email): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/emailAvailable/${btoa(email.email)}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isEmailAvailable")
    }
}

async function isPasswordIsValid(password: string): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/isPasswordIsValid/${btoa(password)}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isPasswordIsValid")
    }
}

async function getUsername(id: UserId): Promise<string | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/username/id/${id}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getUsername")
    }
}

async function getUser(): Promise<IUser | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getUser")
    }
}

async function deleteUser(verificationCode: number, password: string): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/users/verificationCode/${verificationCode}/password/${btoa(password)}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteUser")
    }
}

async function putUser(password: string, username?: string, newPassword?: string, email?: Email, code?: number, newCode?: number): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/users/`, {
            password,
            username,
            newPassword,
            email: email?.email,
            verificationCode: code,
            newVerificationCode: newCode
        }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putUser")
    }
}

async function isAvatarExists(id: UserId): Promise<boolean | ExError> {
    try {
        const result = await axios.get(`${backendBaseUrl}/api/users/avatars/isExists/id/${id}`, defaultAxiosRequestConfig)

        return result.data
    } catch (e) {
        return errorWrapper(e, "checkAvatar")
    }
}

async function createAvatar(image: File): Promise<void | ExError> {
    try {
        if (!OwnedUser.instance) {
            return
        }

        const formData = new FormData()
        formData.append("image", image)
        formData.append("id", OwnedUser.instance.id.id.toString())

        await axios.postForm(`${backendBaseUrl}/api/users/avatars/create`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "createAvatar")
    }
}

async function deleteAvatar(): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/users/avatars`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteAvatar")
    }
}

async function putAvatar(image: File): Promise<void | ExError> {
    try {
        if (!OwnedUser.instance) {
            return
        }

        const formData = new FormData()
        formData.append("image", image)
        formData.append("id", OwnedUser.instance.id.id.toString())

        await axios.putForm(`${backendBaseUrl}/api/users/avatars`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putAvatar")
    }
}

export {
    isUsernameAvailable,
    isEmailAvailable,
    isPasswordIsValid,
    getUsername,
    getUser,
    deleteUser,
    putUser,
    isAvatarExists,
    createAvatar,
    deleteAvatar,
    putAvatar
}
