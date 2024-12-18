import { createSlice, Middleware } from "@reduxjs/toolkit";
import { BasketState } from "../types";

function getBasket(): BasketState {
    let data: BasketState = {}

    try {
        const stringData = localStorage.getItem("basket")
        data = stringData == null ? {} : JSON.parse(stringData)
    } catch (e) {
        localStorage.removeItem("basket")
    }

    return data
}

const initialState: BasketState = getBasket()

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        setProduct(state, action: { type: string, payload: { productId: number, count: number } }) {
            state[action.payload.productId] = action.payload.count
        },

        removeProduct(state, action: { type: string, payload: number }) {
            state[action.payload] = undefined
        }
    }
})

const basketSavingMiddleware: Middleware = (_) => (next) => (action: any) => {
    if (action.type == "basket/setProduct" || action.type == "basket/removeProduct" || action.type == "basket/clear") {
        const basket = getBasket()

        if (action.type == "basket/setProduct") {
            basket[action.payload.productId] = action.payload.count
        } else {
            basket[action.payload] = undefined
        }

        localStorage.setItem("basket", JSON.stringify(basket))
    }

    return next(action)
}

export default basketSlice
export const basketReducer = basketSlice.reducer
export { basketSavingMiddleware }
