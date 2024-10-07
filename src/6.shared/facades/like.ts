import { createLike, deleteLike, getLikes, getLikesCount } from "@shared/api/likes";
import { ExError } from "@shared/helpers";
import { ILike, ISerializedLike } from "@shared/model/interfaces";
import { LikeType } from "@shared/model/types/enums";
import { Id, LikeId, UserId } from "@shared/model/types/primitives";
import store from "@shared/store";
import { addLike, removeLike } from "@shared/store/actionCreators/like";

class Like {

    // Private fields

    private _like: ILike

    // Getters

    public get id(): LikeId {
        return this._like.id
    }

    public get from(): UserId {
        return this._like.from
    }

    public get target(): Id {
        return this._like.target
    }

    public get type(): LikeType {
        return this._like.type
    }

    // Methods

    public async delete(): Promise<void | ExError> {

        // Removing like from global store (deprecated)
        // store.dispatch(removeLike(this.id))

        return await deleteLike(this.id)
    }

    public serialize(): ISerializedLike {
        return {
            id: this.id.id,
            from: this.from.id,
            target: this.target.id,
            type: this.type
        }
    }

    // Static constructors

    public static async getList(): Promise<Array<Like> | ExError> {
        const likes: Array<ILike> | ExError = await getLikes()

        if (likes instanceof ExError) {
            return likes
        }

        return likes.map(like => new Like(like))
    }

    public static async getLikesCount(target: Id, type: LikeType): Promise<number | ExError> {
        return await getLikesCount(target, type)
    }

    public static async create(target: Id, type: LikeType): Promise<Like | ExError> {
        const ilike: ILike | ExError = await createLike(target, type)

        if (ilike instanceof ExError) {
            return ilike
        }

        const like: Like = new Like(ilike)

        // Adding like to global store (deprecated)
        // store.dispatch(addLike(like.serialize()))

        return like
    }

    public static parse(like: ISerializedLike): Like | ExError {
        if (!(
            "id" in like &&
            "from" in like &&
            "target" in like &&
            "type" in like
        )) {
            return new ExError("Invalid object to parse into like", -400)
        }

        return new Like({
            id: new LikeId(like.id),
            from: new UserId(like.from),
            target: new Id(like.target),
            type: like.type
        })
    }

    // Constructor

    private constructor({ id, from, target, type }: ILike) {
        this._like = { id, from, target, type }
    }
}

export { Like }
