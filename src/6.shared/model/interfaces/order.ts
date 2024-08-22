import { ExError } from "@shared/helpers";
import { OrderType, PaymentStatus } from "@shared/model/types/enums";
import { Moment, OrderId, ProductId, UserId, OrderInfo } from "@shared/model/types/primitives";

interface IOrder {
    id: OrderId,
    from: UserId,
    paymentId: string,
    paymentStatus: PaymentStatus,
    moment: Moment,
    orderType: OrderType,
    orderInfo: OrderInfo,
    productIds: Array<ProductId>,
    readyMoment: Moment
}

function responseDataToOrder(data: any): IOrder {
    if (!(
        "id" in data &&
        "from" in data &&
        "paymentId" in data &&
        "paymentStatus" in data &&
        "moment" in data &&
        "orderType" in data &&
        "orderInfo" in data &&
        "productIds" in data &&
        "readyMoment" in data
    )) {
        throw new ExError("Invalid response data to convert into IOrder", 500)
    }

    return {
        id: new OrderId(data.id),
        from: new UserId(data.from),
        paymentId: data.paymentId,
        paymentStatus: data.paymentStatus,
        moment: new Moment(data.moment),
        orderType: data.orderType,
        orderInfo: data.orderInfo,
        productIds: data.productIds.map((productId: number) => new ProductId(productId)),
        readyMoment: new Moment(data.readyMoment)
    }
}

export { IOrder, responseDataToOrder }
