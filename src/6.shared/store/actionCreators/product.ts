import { ListProduct } from "@shared/facades";
import { AppDispatch } from "..";
import { ExError } from "@shared/helpers";
import productsSlice from "../slices/productsSlice";

function fetchProducts() {
    return async (dispatch: AppDispatch) => {
        dispatch(productsSlice.actions.productsFetching())

        const products: Array<ListProduct> | ExError = await ListProduct.getProductsList()

        if (products instanceof ExError) {
            dispatch(productsSlice.actions.productsFetchingError(products.statusCode))
            return
        }

        dispatch(productsSlice.actions.productsFetchingSuccess(products.map(product => product.serialize())))
    }
}

export { fetchProducts }
