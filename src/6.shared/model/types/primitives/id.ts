class Id {
    private _id: number

    public get id(): number {
        return this._id
    }

    public toString(): string {
        return this._id.toString()
    }

    public constructor(id: number | string) {
        if (typeof id === "string") {
            id = parseInt(id)
        }

        let isValid = true

        isValid = isValid && Math.round(id) - id == 0
        isValid = isValid && id >= 0

        if (!isValid) {
            throw new Error(`Invalid id(${id})`)
        }

        this._id = id
    }
}

class CommentId extends Id { }

class FeaturedId extends Id { }

class LikeId extends Id { }

class NewId extends Id { }

class ProductId extends Id { }

class RecipeId extends Id { }

class ReviewId extends Id { }

class UserId extends Id { }

class MediaId extends Id { }

class ItemId extends Id { }

class OrderId extends Id { }

class SessionId extends Id { }

class ImageId extends Id { }

export {
    Id,
    CommentId,
    FeaturedId,
    LikeId,
    NewId,
    ProductId,
    RecipeId,
    ReviewId,
    UserId,
    MediaId,
    ItemId,
    OrderId,
    SessionId,
    ImageId
}
