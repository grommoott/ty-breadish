import { IOrder } from "@shared/model/interfaces"
import { CourierOrderState, OrderType, PaymentStatus, PickUpOrderState } from "@shared/model/types/enums"
import { BakeryId, Moment, OrderId, OrderInfo, ProductId, UserId } from "@shared/model/types/primitives"
import { Product } from "./item/product"
import { ExError } from "@shared/helpers"
import { changeOrderReadyMoment, changeOrderState, createOrder, deleteOrder, getOrder, getOrderByBakeryId, getOrders } from "@shared/api/orders"

class Order {

    // Private fields

    private _order: IOrder
    private _products: Array<Product> | undefined

    // Getters

    public get id(): OrderId {
        return this._order.id
    }

    public get from(): UserId {
        return this._order.from
    }

    public get paymentId(): string {
        return this._order.paymentId
    }

    public get paymentStatus(): PaymentStatus {
        return this._order.paymentStatus
    }

    public get moment(): Moment {
        return this._order.moment
    }

    public get orderType(): OrderType {
        return this._order.orderType
    }

    public get orderInfo(): OrderInfo {
        return this._order.orderInfo
    }

    public get productIds(): Array<ProductId> {
        return this._order.productIds
    }

    public get readyMoment(): Moment {
        return this._order.readyMoment
    }

    public get paymentUrl(): string {
        return `https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=${this.paymentId}`
    }

    // Methods

    public async getProducts(): Promise<Array<Product> | ExError> {
        if (!this._products) {
            const productsPromises: Array<Promise<Product | ExError>> = this.productIds.map(productId => Product.fromId(productId))

            await Promise.all(productsPromises)

            const products: Array<Product> = new Array<Product>()
            let error: ExError | Object = new Object()

            productsPromises.forEach(productPromise => productPromise.then(product => {
                if (product instanceof ExError) {
                    error = product
                } else {
                    products.push(product)
                }
            }))

            if (error instanceof ExError) {
                return error
            }

            this._products = products
        }

        return this._products
    }

    public async changeState(state: PickUpOrderState | CourierOrderState): Promise<void | ExError> {
        return await changeOrderState(this.id, state)
    }

    public async changeReadyMoment(readyMoment: Moment): Promise<void | ExError> {
        return await changeOrderReadyMoment(this.id, readyMoment)
    }

    public async delete(): Promise<void | ExError> {
        return await deleteOrder(this.id)
    }

    // Static constructors 

    public static async fromId(id: OrderId): Promise<Order | ExError> {
        const order: IOrder | ExError = await getOrder(id)

        if (order instanceof ExError) {
            return order
        }

        return new Order(order)
    }

    public static async getList(): Promise<Array<Order> | ExError> {
        const orders: Array<IOrder> | ExError = await getOrders()

        if (orders instanceof ExError) {
            return orders
        }

        return orders.map(order => new Order(order))
    }

    public static async getByBakery(id: BakeryId): Promise<Array<Order> | ExError> {
        const orders: Array<IOrder> | ExError = await getOrderByBakeryId(id)

        if (orders instanceof ExError) {
            return orders
        }

        return orders.map(order => new Order(order))
    }

    public static async create<T extends OrderInfo>(orderType: OrderType, orderInfo: T, productIds: Array<ProductId>): Promise<Order | ExError> {
        const order: IOrder | ExError = await createOrder(orderType, orderInfo, productIds)

        if (order instanceof ExError) {
            return order
        }

        return new Order(order)
    }

    // Constructor

    private constructor({ id, from, paymentId, paymentStatus, moment, orderType, orderInfo, productIds, readyMoment }: IOrder) {
        this._order = { id, from, paymentId, paymentStatus, moment, orderType, orderInfo, productIds, readyMoment }
    }
}

export { Order }
