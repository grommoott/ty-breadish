import { Ingredient } from "@shared/model/types/enums"

type ProductFilterData = {
    includeIngredients: Array<Ingredient>,
    excludeIngredients: Array<Ingredient>,
    minPrice?: number,
    maxPrice?: number
}

export { ProductFilterData }
