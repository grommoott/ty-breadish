import { CookingMethod } from "../enums/itemInfo/cookingMethod"
import { Ingredient } from "../enums/itemInfo/ingredient"

type PFC = {
    kkal: number,
    protein: number,
    fat: number,
    carbs: number
}

type ItemInfoJson = {
    cooking_method: CookingMethod,
    ingredients: Ingredient[],
    pfc: {
        kkal: number,
        protein: number,
        fat: number,
        carbs: number
    }
}

class ItemInfo {
    public cookingMethod: CookingMethod

    public ingredients: Ingredient[]

    public pfc: PFC

    public static fromJSON(json: string): ItemInfo {
        const itemInfo: ItemInfoJson = JSON.parse(json)

        const pfc: PFC = { ...itemInfo.pfc }

        return new ItemInfo(itemInfo.cooking_method, itemInfo.ingredients, pfc)
    }

    public static fromObject(obj: ItemInfoJson): ItemInfo {
        return new ItemInfo(obj.cooking_method, obj.ingredients, obj.pfc)
    }

    public toJSON(): string {
        const itemInfo = this.toNormalView()

        return JSON.stringify(itemInfo)
    }

    public toNormalView(): object {
        return {
            cookingMethod: this.cookingMethod,
            ingredients: this.ingredients,
            pfc: this.pfc
        }
    }

    public constructor(cookingMethod: CookingMethod, ingredients: Ingredient[], pfc: PFC) {
        this.cookingMethod = cookingMethod
        this.ingredients = ingredients
        this.pfc = pfc
    }
}

export { ItemInfo }
