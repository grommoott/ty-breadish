const PickUpOrderStates = {
    RequestSent: "requestSent",
    Cooking: "cooking",
    Waiting: "waiting",
    Completed: "completed"
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

        case PickUpOrderStates.Completed:
            return "Забран"
    }
}

export { PickUpOrderState, PickUpOrderStates, translatePickUpOrderState }
