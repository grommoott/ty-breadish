import { Like } from "@shared/facades/like";
import { AppDispatch } from "..";
import likesSlice from "../slices/likesSlice";
import { ExError } from "@shared/helpers";
import { ISerializedLike } from "@shared/model/interfaces";

function fetchLikes() {
    return async (dispatch: AppDispatch) => {
        dispatch(likesSlice.actions.likesFetching())

        const likes: Array<Like> | ExError = await Like.getList()

        if (likes instanceof ExError) {
            dispatch(likesSlice.actions.likesFetchingError(likes.statusCode))
            return
        }

        dispatch(likesSlice.actions.likesFetchingSuccess(likes.map(like => like.serialize())))
    }
}

function addLike(like: ISerializedLike) {
    return async (dispatch: AppDispatch) => {
        dispatch(likesSlice.actions.addLike(like))
    }
}

function removeLike(id: number) {
    return async (dispatch: AppDispatch) => {
        dispatch(likesSlice.actions.removeLike(id))
    }
}

export { fetchLikes, addLike, removeLike }
