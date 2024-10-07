import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IReview, responseDataToReview } from "@shared/model/interfaces";
import { Rate, ReviewsSortOrder } from "@shared/model/types/enums";
import { ItemId, ReviewId } from "@shared/model/types/primitives";
import axios from "axios";

async function getReviewsPage(target: ItemId, sortOrder: ReviewsSortOrder, page: number): Promise<Array<IReview> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/reviews/target/${target}/sortOrder/${sortOrder}/page/${page}`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToReview)
    } catch (e) {
        return errorWrapper(e, "getReviewsPage")
    }
}

async function createReview(target: ItemId, content: string, rate: Rate): Promise<IReview | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/reviews/create`, {
            target: target.id,
            content,
            rate
        }, defaultAxiosRequestConfig)

        return responseDataToReview(response.data)
    } catch (e) {
        return errorWrapper(e, "createReview")
    }
}

async function deleteReview(id: ReviewId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/reviews/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteReview")
    }
}

async function putReview(id: ReviewId, content?: string, rate?: Rate): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/reviews`, {
            id: id.id,
            content,
            rate
        }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putReview")
    }
}

export { getReviewsPage, createReview, deleteReview, putReview }
