import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IListNew, INew, responseDataToListNew, responseDataToNew } from "@shared/model/interfaces";
import { NewId } from "@shared/model/types/primitives";
import axios from "axios";

async function getNewsPage(page: number): Promise<Array<IListNew> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/news/page/${page}`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToListNew)
    } catch (e) {
        return errorWrapper(e, "getNewsPage")
    }
}

async function getNew(id: NewId): Promise<INew | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/news/id/${id}`, defaultAxiosRequestConfig)

        return responseDataToNew(response.data)
    } catch (e) {
        return errorWrapper(e, "getNew")
    }
}

async function createNew(title: string, content: string): Promise<INew | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/news/create`, {
            title,
            content
        }, defaultAxiosRequestConfig)

        return responseDataToNew(response.data)
    } catch (e) {
        return errorWrapper(e, "createNew")
    }
}

async function deleteNew(id: NewId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/news/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteNew")
    }
}

async function putNew(id: NewId, title?: string, content?: string): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/news`, {
            id: id.id,
            title,
            content
        }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putNew")
    }
}

async function isNewImageExists(id: NewId): Promise<void | ExError> {
    try {
        const result = await axios.get(`${backendBaseUrl}/api/news/images/id/${id}`, defaultAxiosRequestConfig)

        return result.data
    } catch (e) {
        return errorWrapper(e, "checkNewImage")
    }
}

async function createNewImage(id: NewId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.postForm(`${backendBaseUrl}/api/news/images/create`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "createNewImage")
    }
}

async function deleteNewImage(id: NewId): Promise<void | ExError> {
    try {
        await axios.post(`${backendBaseUrl}/api/news/images/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteNewImage")
    }
}

async function putNewImage(id: NewId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.putForm(`${backendBaseUrl}/api/news/images`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putNewImage")
    }
}

export {
    getNewsPage,
    getNew,
    createNew,
    deleteNew,
    putNew,
    isNewImageExists,
    createNewImage,
    deleteNewImage,
    putNewImage
}
