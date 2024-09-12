import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IListProduct, IProduct, responseDataToListProduct, responseDataToProduct } from "@shared/model/interfaces";
import { ItemInfo, Price, ProductId } from "@shared/model/types/primitives";
import axios from "axios";

async function getProduct(id: ProductId): Promise<IProduct | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/products/id/${id}`, defaultAxiosRequestConfig)

        return responseDataToProduct(response.data)
    } catch (e) {
        return errorWrapper(e, "getProduct")
    }
}

async function getProductsList(): Promise<Array<IListProduct> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/products/list`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToListProduct)
    } catch (e) {
        return errorWrapper(e, "getProductsList")
    }
}

async function createProduct(price: Price, name: string, description: string, itemInfo: ItemInfo): Promise<IProduct | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/products/create`, {
            price: price.price,
            name,
            description,
            itemInfo
        }, defaultAxiosRequestConfig)

        return responseDataToProduct(response.data)
    } catch (e) {
        return errorWrapper(e, "createProduct")
    }
}

async function deleteProduct(id: ProductId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/products/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteProduct")
    }
}

async function putProduct(id: ProductId, price?: Price, name?: string, description?: string, itemInfo?: ItemInfo): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/products`, {
            id: id.id,
            price: price?.price,
            name,
            description,
            itemInfo
        }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putproduct")
    }
}

async function checkProductImage(id: ProductId): Promise<void | ExError> {
    try {
        await axios.get(`${backendBaseUrl}/api/products/images/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "getProductImage")
    }
}

async function createProductImage(id: ProductId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.postForm(`${backendBaseUrl}/api/products/images/create`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "createProductImage")
    }
}

async function deleteProductImage(id: ProductId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/products/images/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteProductImage")
    }
}

async function putProductImage(id: ProductId, image: File): Promise<void | ExError> {
    try {
        const formData = new FormData()
        formData.append("id", id.toString())
        formData.append("image", image)

        await axios.putForm(`${backendBaseUrl}/api/products/images`, formData, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "putProductImage")
    }
}

export {
    getProduct,
    getProductsList,
    createProduct,
    deleteProduct,
    putProduct,
    checkProductImage,
    createProductImage,
    deleteProductImage,
    putProductImage
}

