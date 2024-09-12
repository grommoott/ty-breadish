import { ExError } from "@shared/helpers";
import { AppDispatch } from "..";
import featuredSlice from "../slices/featuredSlice";
import { Featured } from "@shared/facades/featured";
import { ISerializedFeatured } from "@shared/model/interfaces";
import { FeaturedId } from "@shared/model/types/primitives";

function fetchFeatured() {
    return async (dispatch: AppDispatch) => {
        dispatch(featuredSlice.actions.featuredFetching())

        const featured: Array<Featured> | ExError = await Featured.getFeatured()

        if (featured instanceof ExError) {
            dispatch(featuredSlice.actions.featuredFetchingError(featured.statusCode))
            return
        }

        dispatch(featuredSlice.actions.featuredFetchingSuccess(featured.map(aFeatured => aFeatured.serialize())))
    }
}

function addFeatured(featured: ISerializedFeatured) {
    return async (dispatch: AppDispatch) => {
        dispatch(featuredSlice.actions.addFeatured(featured))
    }
}

function removeFeatured(id: FeaturedId) {
    return async (dispatch: AppDispatch) => {
        dispatch(featuredSlice.actions.removeFeatured(id))
    }
}

export { fetchFeatured, addFeatured, removeFeatured }
