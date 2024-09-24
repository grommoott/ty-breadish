import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IComment, responseDataToComment } from "@shared/model/interfaces";
import { CommentsSortOrder } from "@shared/model/types/enums";
import { CommentId, MediaId } from "@shared/model/types/primitives";
import axios from "axios";

async function getCommentsPage(target: MediaId, sortOrder: CommentsSortOrder, page: number): Promise<Array<IComment> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/comments/target/${target}/sortOrder/${sortOrder}/page/${page}`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToComment)
    } catch (e) {
        return errorWrapper(e, "getCommentsPage")
    }
}

async function getCommentsCount(target: MediaId): Promise<number | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/comments/count/target/${target.id}`)

        return response.data.count
    } catch (e) {
        return errorWrapper(e, "getCommentsCount")
    }
}

async function createComment(target: MediaId, content: string): Promise<IComment | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/comments/create`, {
            target: target.id,
            content
        }, defaultAxiosRequestConfig)

        return responseDataToComment(response.data)
    } catch (e) {
        return errorWrapper(e, "createComment")
    }
}

async function deleteComment(id: CommentId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/comments/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteComment")
    }
}

async function putComment(id: CommentId, content?: string): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/comments`, {
            id: id.id,
            content
        }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putComment")
    }
}

export {
    getCommentsPage,
    getCommentsCount,
    createComment,
    deleteComment,
    putComment
}
