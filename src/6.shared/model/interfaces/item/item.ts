import { ItemId, AvgRate, ItemInfo } from "@shared/model/types/primitives"

interface IItem {
    itemId: ItemId,
    name: string,
    description: string,
    avgRate: AvgRate,
    itemInfo: ItemInfo
}

export { IItem }
