import { isInEnum } from "@shared/helpers"
import { CourierOrderState, PickUpOrderState, PickUpOrderStates } from "../enums/orderInfo"
import { BakeryId } from "./id"

interface PickUpOrderInfo {
    bakeryId: BakeryId,
    state: PickUpOrderState,
    productCounts: { [id: number]: number }
}

interface CourierOrderInfo {
    bakeryId: BakeryId,
    deliveryAddress: string,
    state: CourierOrderState,
    productCounts: { [id: number]: number }
}

function isOrderInfoIsPickUpOrderInfo(orderInfo: OrderInfo): orderInfo is PickUpOrderInfo {
    return isInEnum(PickUpOrderStates, (orderInfo as PickUpOrderInfo)?.state)
}

function isOrderInfoIsCourierOrderInfo(orderInfo: OrderInfo): orderInfo is CourierOrderInfo {
    return typeof (orderInfo as CourierOrderInfo)?.deliveryAddress === "string" &&
        isInEnum(PickUpOrderStates, (orderInfo as PickUpOrderInfo)?.state)
}

type OrderInfo = PickUpOrderInfo | CourierOrderInfo

export { PickUpOrderInfo, CourierOrderInfo, isOrderInfoIsPickUpOrderInfo, isOrderInfoIsCourierOrderInfo, OrderInfo }
