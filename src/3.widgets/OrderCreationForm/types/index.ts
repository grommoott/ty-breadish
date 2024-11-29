import { OrderType } from "@shared/model/types/enums"
import { BakeryId, ProductId } from "@shared/model/types/primitives"
import { Dispatch, SetStateAction } from "react"

type FormData = {
    courierOrderInfo?: {
        bakeryId?: BakeryId,
        deliveryAddress?: string,
    },
    pickUpOrderInfo?: {
        bakeryId?: BakeryId
    },
    productCounts?: { [id: string]: number },
    productIds?: ProductId[],
    orderType?: OrderType
}

type ErrorData = {
    courierOrderInfo: {
        bakeryId: string,
        deliveryAddress: string,
    },
    pickUpOrderInfo: {
        bakeryId: string,
    },
    orderType: string
}

interface OrderFormProps {
    formData: FormData,
    setFormData: Dispatch<SetStateAction<FormData>>,
    errorData: ErrorData,
    setErrorData: Dispatch<SetStateAction<ErrorData>>
}

export { FormData, ErrorData, OrderFormProps }
