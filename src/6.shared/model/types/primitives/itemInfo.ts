import { CookingMethod } from "../enums/itemInfo/cookingMethod"
import { Ingredient } from "../enums/itemInfo/ingredient"

type PFC = {
    kkal: number,
    protein: number,
    fat: number,
    carbs: number
}

type ItemInfoJson = {
    cookingMethod: CookingMethod,
    ingredients: Ingredient[],
    mass: number,
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

    public mass: number

    public static fromJSON(json: string): ItemInfo {
        const itemInfo: ItemInfoJson = JSON.parse(json)

        const pfc: PFC = { ...itemInfo.pfc }

        return new ItemInfo(itemInfo.cookingMethod, itemInfo.ingredients, pfc, itemInfo.mass)
    }

    public static fromObject(obj: ItemInfoJson): ItemInfo {
        return new ItemInfo(obj.cookingMethod, obj.ingredients, obj.pfc, obj.mass)
    }

    public toJSON(): string {
        const itemInfo = this.toNormalView()

        return JSON.stringify(itemInfo)
    }

    public toNormalView(): ItemInfoJson {
        return {
            cookingMethod: this.cookingMethod,
            ingredients: this.ingredients,
            pfc: this.pfc,
            mass: this.mass
        }
    }

    public constructor(cookingMethod: CookingMethod, ingredients: Ingredient[], pfc: PFC, mass: number) {
        this.cookingMethod = cookingMethod
        this.ingredients = ingredients
        this.pfc = pfc
        this.mass = mass
    }
}

export { ItemInfo, ItemInfoJson }
