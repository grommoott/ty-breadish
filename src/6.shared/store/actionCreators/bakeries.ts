import { Bakery } from "@shared/facades";
import { AppDispatch } from "..";
import bakeriesSlice from "../slices/bakeries";
import { ExError } from "@shared/helpers";

function fetchBakeries() {
    return async (dispatch: AppDispatch) => {
        dispatch(bakeriesSlice.actions.bakeriesFetching())

        const response = await Bakery.getList()

        if (response instanceof ExError) {
            dispatch(bakeriesSlice.actions.bakeriesFetchingError(response.statusCode))
            console.error(response)
            return
        }

        dispatch(bakeriesSlice.actions.bakeriesFetchingSuccess(response.map(bakery => bakery.serialize())))
    }
}

export default fetchBakeries
