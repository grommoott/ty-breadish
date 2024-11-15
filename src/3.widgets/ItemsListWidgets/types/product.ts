import { Ingredient } from "@shared/model/types/enums"

type ProductFilterData = {
    includeIngredients: Array<Ingredient>,
    excludeIngredients: Array<Ingredient>,
    minPrice?: number,
    maxPrice?: number,
    query: string
}

export { ProductFilterData }
