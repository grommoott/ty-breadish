import { CookingMethod, Ingredient } from "@shared/model/types/enums"
import { ItemFilterDataBase } from "."

type ProductsFilterData = {
    minPrice?: number,
    maxPrice?: number,
} & ItemFilterDataBase

export { ProductsFilterData }
