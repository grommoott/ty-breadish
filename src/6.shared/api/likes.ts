import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { ILike, responseDataToLike } from "@shared/model/interfaces";
import { LikeType } from "@shared/model/types/enums";
import { Id, LikeId } from "@shared/model/types/primitives";
import axios from "axios";

async function getLikes(): Promise<Array<ILike> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/likes`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToLike)
    } catch (e) {
        return errorWrapper(e, "getLikes")
    }
}

async function getLikesCount(target: Id, type: LikeType): Promise<number | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/likes/count/target/${target}/type/${type}`, defaultAxiosRequestConfig)

        return response.data
    } catch (e) {
        return errorWrapper(e, "getLikesCount")
    }
}

async function createLike(target: Id, type: LikeType): Promise<ILike | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/likes/create`, {
            target: target.id,
            type
        }, defaultAxiosRequestConfig)

        return responseDataToLike(response.data)
    } catch (e) {
        return errorWrapper(e, "createLike")
    }
}

async function deleteLike(id: LikeId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/likes/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteLike")
    }
}

export {
    getLikes,
    getLikesCount,
    createLike,
    deleteLike
}
