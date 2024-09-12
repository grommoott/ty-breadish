import { ExError } from "@shared/helpers"
import { ItemType } from "@shared/model/types/enums"
import { FeaturedId, ItemId, UserId } from "@shared/model/types/primitives"

interface IFeatured {
    id: FeaturedId,
    from: UserId,
    target: ItemId,
    itemType: ItemType
}

interface ISerializedFeatured {
    id: number,
    from: number,
    target: number,
    itemType: ItemType
}

function responseDataToFeatured(data: any): IFeatured {
    if (!(
        "id" in data &&
        "from" in data &&
        "target" in data &&
        "itemType" in data
    )) {
        throw new ExError("Invalid response data to convert into IFeatured", 500)
    }

    return {
        id: new FeaturedId(data.id),
        from: new UserId(data.from),
        target: new ItemId(data.target),
        itemType: data.itemType
    }
}

export { IFeatured, ISerializedFeatured, responseDataToFeatured }
