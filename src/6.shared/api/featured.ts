import { backendBaseUrl } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IFeatured, responseDataToFeatured } from "@shared/model/interfaces";
import { ItemType } from "@shared/model/types/enums";
import { FeaturedId, ItemId } from "@shared/model/types/primitives";
import axios from "axios";

async function getFeatured(): Promise<Array<IFeatured> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/featured`)

        return response.data.map(responseDataToFeatured)
    } catch (e) {
        return errorWrapper(e, "getFeatured")
    }
}

async function createFeatured(target: ItemId, itemType: ItemType): Promise<IFeatured | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/featured/create`, {
            target: target.id,
            itemType
        })

        return responseDataToFeatured(response.data)
    } catch (e) {
        return errorWrapper(e, "createFeatured")
    }
}

async function deleteFeatured(id: FeaturedId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/featured/id/${id}`)
    } catch (e) {
        return errorWrapper(e, "deleteFeatured")
    }
}

export { getFeatured, createFeatured, deleteFeatured }
