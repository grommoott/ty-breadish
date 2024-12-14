const OrderTypes = {
    PickUp: "pickUp",
    Courier: "courier"
} as const

type OrderType = typeof OrderTypes[keyof typeof OrderTypes]

function translateOrderType(type: OrderType): string {
    switch (type) {
        case OrderTypes.PickUp:
            return "Самовывоз"

        case OrderTypes.Courier:
            return "Курьер"
    }
}

export { OrderType, OrderTypes, translateOrderType }
