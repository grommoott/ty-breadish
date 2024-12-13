const PickUpOrderStates = {
    RequestSent: "requestSent",
    Cooking: "cooking",
    Waiting: "waiting"
} as const

type PickUpOrderState = typeof PickUpOrderStates[keyof typeof PickUpOrderStates]

function translatePickUpOrderState(state: PickUpOrderState) {
    switch (state) {
        case PickUpOrderStates.RequestSent:
            return "Запрос отправлен"

        case PickUpOrderStates.Cooking:
            return "Готовится"

        case PickUpOrderStates.Waiting:
            return "Можно забирать"
    }
}

export { PickUpOrderState, PickUpOrderStates, translatePickUpOrderState }
