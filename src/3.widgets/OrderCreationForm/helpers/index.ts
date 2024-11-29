import { OrderType } from "@shared/model/types/enums";
import { BakeryId } from "@shared/model/types/primitives";

const bakeryIdValidator: (id?: BakeryId) => Promise<string> = async (id) => {
    if (!id) {
        return "Нужно выбрать пекарню"
    }

    return ""
}

const orderTypeValidator: (type?: OrderType) => Promise<string> = async (id) => {
    if (!id) {
        return "Нужно выбрать метод получения"
    }

    return ""
}

export { bakeryIdValidator, orderTypeValidator }
