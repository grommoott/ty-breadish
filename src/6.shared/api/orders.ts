import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { errorWrapper, ExError } from "@shared/helpers";
import { IOrder, responseDataToOrder } from "@shared/model/interfaces";
import { OrderType } from "@shared/model/types/enums";
import { OrderId, OrderInfo, ProductId } from "@shared/model/types/primitives";
import axios from "axios";

async function getOrders(): Promise<Array<IOrder> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/orders`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToOrder)
    } catch (e) {
        return errorWrapper(e, "getOrders")
    }
}

async function createOrder(orderType: OrderType, orderInfo: OrderInfo, productIds: Array<ProductId>): Promise<IOrder | ExError> {
    try {
        const response = await axios.post(`${backendBaseUrl}/api/orders/create`, {
            orderType,
            orderInfo,
            productIds: productIds.map(productId => productId.id)
        }, defaultAxiosRequestConfig)

        return responseDataToOrder(response)
    } catch (e) {
        return errorWrapper(e, "createOrder")
    }
}

async function deleteOrder(id: OrderId): Promise<void | ExError> {
    try {
        await axios.delete(`${backendBaseUrl}/api/orders/id/${id}`, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "deleteOrder")
    }
}

export {
    getOrders,
    createOrder,
    deleteOrder
}
