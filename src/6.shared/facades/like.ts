import { createLike, deleteLike, getLikes, getLikesCount } from "@shared/api/likes";
import { ExError } from "@shared/helpers";
import { ILike } from "@shared/model/interfaces";
import { LikeType } from "@shared/model/types/enums";
import { Id, LikeId, UserId } from "@shared/model/types/primitives";

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
        return await deleteLike(this.id)
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
        const like: ILike | ExError = await createLike(target, type)

        if (like instanceof ExError) {
            return like
        }

        return new Like(like)
    }

    // Constructor

    private constructor({ id, from, target, type }: ILike) {
        this._like = { id, from, target, type }
    }
}

export { Like }
