import { backendBaseUrl, defaultAxiosRequestConfig } from "@shared/config";
import { Order } from "@shared/facades";
import { errorWrapper, ExError } from "@shared/helpers";
import { IOrder, responseDataToOrder } from "@shared/model/interfaces";
import { CourierOrderState, OrderType, PickUpOrderState } from "@shared/model/types/enums";
import { BakeryId, OrderId, OrderInfo, ProductId } from "@shared/model/types/primitives";
import axios from "axios";

async function getOrder(id: BakeryId): Promise<IOrder | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/orders/id/${id}`, defaultAxiosRequestConfig)

        return responseDataToOrder(response.data)
    } catch (e) {
        return errorWrapper(e, "getOrder")
    }
}

async function getOrders(): Promise<Array<IOrder> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/orders/list`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToOrder)
    } catch (e) {
        return errorWrapper(e, "getOrders")
    }
}

async function getOrderByBakeryId(id: BakeryId): Promise<Array<Order> | ExError> {
    try {
        const response = await axios.get(`${backendBaseUrl}/api/orders/byBakeryId/id/${id}`, defaultAxiosRequestConfig)

        return response.data.map(responseDataToOrder)
    } catch (e) {
        return errorWrapper(e, "getOrderByBakeryId")
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

async function changeOrderState<T extends CourierOrderState | PickUpOrderState>(id: OrderId, state: T) {
    try {
        await axios.put(`${backendBaseUrl}/api/orders/changeOrderState`, { id: id.id, state }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "changeOrderState")
    }
}

async function markOrderAsCompleted(id: OrderId): Promise<void | ExError> {
    try {
        await axios.put(`${backendBaseUrl}/api/orders/markAsCompleted`, { id: id.id }, defaultAxiosRequestConfig)
    } catch (e) {
        return errorWrapper(e, "markOrderAsCompleted")
    }
}

export {
    getOrder,
    getOrders,
    getOrderByBakeryId,
    createOrder,
    deleteOrder,
    changeOrderState,
    markOrderAsCompleted
}
