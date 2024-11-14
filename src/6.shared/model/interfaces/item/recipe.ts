import { AvgRate, ItemId, ItemInfo, RecipeId } from "@shared/model/types/primitives"
import { IItem, ISerializedItem } from "./item"
import { ExError } from "@shared/helpers"

interface IRecipe extends IItem {
    id: RecipeId,
    recipe: string
}

interface IListRecipe extends Omit<IRecipe, "description" | "recipe"> { }

interface ISerializedListRecipe extends ISerializedItem {
    id: number,
}

function isItemIsRecipe(item: IItem): item is IRecipe {
    return (item as IRecipe)?.id instanceof RecipeId
}

function responseDataToRecipe(data: any): IRecipe {
    if (!(
        "id" in data &&
        "recipe" in data &&
        "itemId" in data &&
        "name" in data &&
        "description" in data &&
        "avgRate" in data &&
        "itemInfo" in data
    )) {
        throw new ExError("Invalid response data to convert into IRecipe", 500)
    }

    return {
        id: new RecipeId(data.id),
        recipe: data.recipe,
        itemId: new ItemId(data.itemId),
        name: data.name,
        description: data.description,
        avgRate: new AvgRate(data.avgRate),
        itemInfo: ItemInfo.fromObject(data.itemInfo)
    }

}

function responseDataToListRecipe(data: any): IListRecipe {
    if (!(
        "id" in data &&
        "itemId" in data &&
        "name" in data &&
        "avgRate" in data &&
        "itemInfo" in data
    )) {
        throw new ExError("Invalid response data to convert into IRecipe's list view", 500)
    }

    return {
        id: new RecipeId(data.id),
        itemId: new ItemId(data.itemId),
        name: data.name,
        avgRate: new AvgRate(data.avgRate),
        itemInfo: ItemInfo.fromJSON(data.itemInfo)
    }
}

export { IRecipe, IListRecipe, ISerializedListRecipe, isItemIsRecipe, responseDataToRecipe, responseDataToListRecipe }
