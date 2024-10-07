import { ItemId, Moment, ReviewId, UserId } from "@shared/model/types/primitives"
import { Rate } from "@shared/model/types/enums"
import { ExError } from "@shared/helpers"

interface IReview {
    id: ReviewId,
    from: UserId,
    target: ItemId,
    content: string,
    rate: Rate,
    moment: Moment
}

function responseDataToReview(data: any): IReview {
    if (!(
        "id" in data &&
        "from" in data &&
        "target" in data &&
        "content" in data &&
        "rate" in data &&
        "moment" in data
    )) {
        throw new ExError("Invalid response data to convert into IReview", 500)
    }


    return {
        id: new ReviewId(data.id),
        from: new UserId(data.from),
        target: new ItemId(data.target),
        content: data.content,
        rate: data.rate,
        moment: new Moment(data.moment)
    }
}

export { IReview, responseDataToReview }
