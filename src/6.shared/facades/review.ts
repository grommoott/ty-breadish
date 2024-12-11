import { getLikesCount } from "@shared/api/likes"
import { createReview, deleteReview, getReviewByItemUser, getReviewsPage, putReview } from "@shared/api/reviews"
import { ExError } from "@shared/helpers"
import { IReview } from "@shared/model/interfaces"
import { LikeTypes, Rate, ReviewsSortOrder } from "@shared/model/types/enums"
import { ItemId, Moment, ReviewId, UserId } from "@shared/model/types/primitives"
import { OwnedUser } from "./user"

class Review {

    // Private fields

    private _review: IReview
    private _likesCount: number | undefined

    // Getters

    public get id(): ReviewId {
        return this._review.id
    }

    public get from(): UserId {
        return this._review.from
    }

    public get target(): ItemId {
        return this._review.target
    }

    public get content(): string {
        return this._review.content
    }

    public get rate(): Rate {
        return this._review.rate
    }

    public get moment(): Moment {
        return this._review.moment
    }

    public get isOwned(): boolean {
        return OwnedUser.instance?.id.id == this.from.id
    }

    // Methods

    protected async edit(content?: string, rate?: Rate): Promise<void | ExError> {
        const edit: void | ExError = await putReview(this.id, content, rate)

        if (edit instanceof ExError) {
            return edit
        }

        if (content) {
            this._review.content = content
        }

        if (rate) {
            this._review.rate = rate
        }
    }

    public async delete(): Promise<void | ExError> {
        return await deleteReview(this.id)
    }

    public async getLikesCount(): Promise<number | ExError> {
        if (!this._likesCount) {
            const likesCount: number | ExError = await getLikesCount(this.id, LikeTypes.Review)

            if (likesCount instanceof ExError) {
                return likesCount
            }

            this._likesCount = likesCount
        }

        return this._likesCount
    }

    // Static constructors

    public static async getReviewsPage(target: ItemId, sortOrder: ReviewsSortOrder, page: number): Promise<Array<Review> | ExError> {
        const reviews: Array<IReview> | ExError = await getReviewsPage(target, sortOrder, page)

        if (reviews instanceof ExError) {
            return reviews
        }

        return reviews.map(review => OwnedReview.tryOccupyReview(new Review(review)))
    }

    public static async fromItemUser(target: ItemId): Promise<OwnedReview | ExError | null> {
        const response: IReview | ExError | null = await getReviewByItemUser(target)

        if (response instanceof ExError) {
            return response
        }

        if (response == null) {
            return null
        }

        const review = OwnedReview.tryOccupyReview(new Review(response))

        if (review instanceof OwnedReview) {
            return review
        } else {
            return new ExError("Impossible error", 666)
        }
    }

    // Constructor

    protected constructor({ id, from, target, content, rate, moment }: IReview) {
        this._review = { id, from, target, content, rate, moment }
    }
}

class OwnedReview extends Review {

    // Methods

    public async edit(content?: string, rate?: Rate) {
        return await super.edit(content, rate)
    }

    // Static constructors

    public static async create(target: ItemId, content: string, rate: Rate): Promise<OwnedReview | ExError> {
        const review: IReview | ExError = await createReview(target, content, rate)

        if (review instanceof ExError) {
            return review
        }

        return new OwnedReview(review)
    }

    public static tryOccupyReview(review: Review): Review | OwnedReview {
        if (review.from.id === OwnedUser.instance?.id.id) {
            return new OwnedReview(review)
        } else {
            return review
        }
    }

    // Constructor

    private constructor({ id, from, target, content, rate, moment }: IReview) {
        super({ id, from, target, content, rate, moment })
    }
}

export { Review, OwnedReview }
