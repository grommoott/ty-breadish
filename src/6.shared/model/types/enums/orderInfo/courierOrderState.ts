const CourierOrderStates = {
    RequestSent: "requestSent",
    Cooking: "cooking",
    WaitingForCourier: "waitingForCourier",
    Delivering: "delivering",
    Completed: "completed"
} as const

type CourierOrderState = typeof CourierOrderStates[keyof typeof CourierOrderStates]

function translateCourierOrderState(state: CourierOrderState) {
    switch (state) {
        case CourierOrderStates.Cooking:
            return "Готовится"

        case CourierOrderStates.Delivering:
            return "В пути"

        case CourierOrderStates.RequestSent:
            return "Запрос отправлен"

        case CourierOrderStates.WaitingForCourier:
            return "Ждёт курьера"

        case CourierOrderStates.Completed:
            return "Доставлен"
    }
}

export { CourierOrderState, CourierOrderStates, translateCourierOrderState }
