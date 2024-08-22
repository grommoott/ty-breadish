import { deleteReview, getReviewsPage, putReview } from "@shared/api/reviews"
import { ExError } from "@shared/helpers"
import { IReview } from "@shared/model/interfaces"
import { Rate, ReviewsSortOrder } from "@shared/model/types/enums"
import { ItemId, Moment, ReviewId, UserId } from "@shared/model/types/primitives"

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

    // Methods

    protected async delete(): Promise<void | ExError> {
        return await deleteReview(this.id)
    }

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

    // Static constructors

    public static async getReviewsPage(target: ItemId, sortOrder: ReviewsSortOrder, page: number): Promise<Array<Review> | ExError> {
        const reviews: Array<IReview> | ExError = await getReviewsPage(target, sortOrder, page)

        if (reviews instanceof ExError) {
            return reviews
        }

        return reviews.map(review => new Review(review))
    }

    // Constructor

    private constructor({ id, from, target, content, rate, moment }: IReview) {
        this._review = { id, from, target, content, rate, moment }
    }
}

class OwnedReview {

}

export { Review, OwnedReview }
