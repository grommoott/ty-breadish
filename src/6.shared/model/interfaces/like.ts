import { ExError } from "@shared/helpers"
import { LikeType } from "@shared/model/types/enums"
import { Id, LikeId, UserId } from "@shared/model/types/primitives"

interface ILike {
    id: LikeId,
    from: UserId,
    target: Id,
    type: LikeType
}

interface ISerializedLike {
    id: number,
    from: number,
    target: number,
    type: LikeType
}

function responseDataToLike(data: any): ILike {
    if (!(
        "id" in data &&
        "from" in data &&
        "target" in data &&
        "type" in data
    )) {
        throw new ExError("Invalid response data to convert into ILike", 500)
    }

    return {
        id: new LikeId(data.id),
        from: new UserId(data.from),
        target: new Id(data.target),
        type: data.type
    }
}

export { ILike, ISerializedLike, responseDataToLike }
