import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IBakery, responseDataToBakery } from "@shared/model/interfaces";
import { BakeryId, Coords } from "@shared/model/types/primitives";
import axios from "axios";

async function getBakery(id: BakeryId): Promise<IBakery | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/bakeries/id/${id}`, defaultAxiosRequestConfig)

        return responseDataToBakery(response.data)
    } catch (e) {
        return errorWrapper(e, "getBakery")
    }
}

async function getBakeries(): Promise<Array<IBakery> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/bakeries/list`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToBakery)
    } catch (e) {
        return errorWrapper(e, "getBakeries")
    }
}

async function createBakery(address: string, coords: Coords): Promise<IBakery | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/bakeries/create`, { address, coords: coords.toNormalView() }, defaultAxiosRequestConfig)

        return responseDataToBakery(response.data)
    } catch (e) {
        return errorWrapper(e, "createBakery")
    }
}

async function deleteBakery(id: BakeryId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/bakeries/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteBakery")
    }
}

async function putBakery(id: BakeryId, address?: string, coords?: Coords): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/bakeries`, { id: id.id, address, coords: coords?.toNormalView }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putBakery")
    }
}

export { getBakery, getBakeries, createBakery, deleteBakery, putBakery }
