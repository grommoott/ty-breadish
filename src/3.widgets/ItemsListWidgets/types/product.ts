import { ItemFilterDataBase } from "."

type ProductsFilterData = {
    minPrice?: number,
    maxPrice?: number,
} & ItemFilterDataBase

export { ProductsFilterData }
