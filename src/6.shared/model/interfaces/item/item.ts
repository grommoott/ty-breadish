import { ItemId, AvgRate, ItemInfo, ItemInfoJson } from "@shared/model/types/primitives"

interface IItem {
    itemId: ItemId,
    name: string,
    description: string,
    avgRate: AvgRate,
    itemInfo: ItemInfo
}

interface ISerializedItem {
    itemId: number,
    name: string,
    avgRate: number,
    itemInfo: ItemInfoJson
}

export { IItem, ISerializedItem }
