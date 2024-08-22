import { backendBaseUrl } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IUser } from "@shared/model/interfaces";
import { Email, UserId } from "@shared/model/types/primitives";
import axios from "axios";

async function isUsernameAvailable(username: string): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/usernameAvailable/${username}`)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isUsernameAvailable")
    }
}

async function isEmailAvailable(email: Email): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/emailAvailable/${email.email}`)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isEmailAvailable")
    }
}

async function isPasswordIsValid(password: string): Promise<boolean | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/isPasswordIsValid/${password}`)

        return response.data
    } catch (e) {
        return errorWrapper(e, "isPasswordIsValid")
    }
}

async function getUsername(id: UserId): Promise<string | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users/username/id/${id}`)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getUsername")
    }
}

async function getUser(): Promise<IUser | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/users`)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getUser")
    }
}

async function deleteUser(verificationCode: number, password: string): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/users/verificationCode/${verificationCode}/password/${password}`)
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
            code,
            newCode
        })
    } catch (e) {
        return errorWrapper(e, "putUser")
    }
}

async function checkAvatar(id: UserId): Promise<void | ExError> {
    try {
        await axios.get(`${backendBaseUrl}/api/users/avatars/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "checkAvatar")
    }
}

async function createAvatar(image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("image", image)

        await axios.postForm(`${backendBaseUrl}/api/users/avatars/create`, formData)
    } catch (e) {
        return errorWrapper(e, "createAvatar")
    }
}

async function deleteAvatar(): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/users/avatars`)
    } catch (e) {
        return errorWrapper(e, "deleteAvatar")
    }
}

async function putAvatar(image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("image", image)

        await axios.putForm(`${backendBaseUrl}/api/users/avatars`, formData)
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
    checkAvatar,
    createAvatar,
    deleteAvatar,
    putAvatar
}
