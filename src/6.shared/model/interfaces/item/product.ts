import { AvgRate, ItemId, ItemInfo, Price, ProductId } from "@shared/model/types/primitives"
import { IItem } from "./item"
import { ExError } from "@shared/helpers"

interface IProduct extends IItem {
    id: ProductId,
    price: Price,
}

interface IListProduct extends Omit<IProduct, "description"> { }

function isItemIsProduct(item: IItem): item is IProduct {
    return (item as IProduct)?.id instanceof ProductId &&
        (item as IProduct)?.id instanceof Price
}

function responseDataToProduct(data: any): IProduct {
    if (!(
        "id" in data &&
        "price" in data &&
        "itemId" in data &&
        "name" in data &&
        "description" in data &&
        "avgRate" in data &&
        "itemInfo" in data
    )) {
        throw new ExError("Invalid response data to convert into IProduct", 500)
    }

    return {
        id: new ProductId(data.id),
        price: new Price(data.price),
        itemId: new ItemId(data.itemId),
        name: data.name,
        description: data.description,
        avgRate: new AvgRate(data.avgRate),
        itemInfo: ItemInfo.fromObject(data.itemInfo)
    }
}

function responseDataToListProduct(data: any): IListProduct {
    if (!(
        "id" in data &&
        "price" in data &&
        "itemId" in data &&
        "name" in data &&
        "avgRate" in data &&
        "itemInfo" in data
    )) {
        throw new ExError("Invalid response data to convert into IProduct's list view", 500)
    }

    return {
        id: new ProductId(data.id),
        price: new Price(data.price),
        itemId: new ItemId(data.itemId),
        name: data.name,
        avgRate: new AvgRate(data.avgRate),
        itemInfo: ItemInfo.fromObject(data.itemInfo)
    }
}

export { IProduct, IListProduct, isItemIsProduct, responseDataToProduct, responseDataToListProduct } 
