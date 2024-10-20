import { CookingMethod, Ingredient } from "@shared/model/types/enums"

type BaseErrorData = {
    name?: string
    image?: string
    mass?: string
    pfc?: { carbs?: string; protein?: string; fat?: string; kkal?: string }
}

type BaseFormData = {
    image?: File
    name: string
    description: string
    carbs: string
    protein: string
    fat: string
    kkal: string
    mass: string
    ingredients: Array<Ingredient>
    cookingMethods: Array<CookingMethod>
}

export { BaseErrorData, BaseFormData }
