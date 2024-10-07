import { ExError } from "@shared/helpers"
import { IItem } from "@shared/model/interfaces"
import { AvgRate, ItemId, ItemInfo } from "@shared/model/types/primitives"

class Item {

    // Private fields

    private _item: IItem

    // Getters

    public get itemId(): ItemId {
        return this._item.itemId
    }

    public get name(): string {
        return this._item.name
    }

    public get description(): string {
        return this._item.description
    }

    public get avgRate(): AvgRate {
        return this._item.avgRate
    }

    public get itemInfo(): ItemInfo {
        return this._item.itemInfo
    }

    // Methods

    protected async _edit(name?: string, description?: string, itemInfo?: ItemInfo): Promise<void | ExError> {
        if (name) {
            this._item.name = name
        }

        if (description) {
            this._item.description = description
        }

        if (itemInfo) {
            this._item.itemInfo = itemInfo
        }
    }

    // Constructor

    protected constructor({ itemId, name, description, avgRate, itemInfo }: IItem) {
        this._item = { itemId, name, description, avgRate, itemInfo }
    }
}

type ListItem = {
    itemId: ItemId
    name: string
    avgRate: AvgRate
    itemInfo: ItemInfo
    imageLink: string
}

export { Item, ListItem }
