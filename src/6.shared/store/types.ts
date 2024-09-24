import { ISerializedFeatured, ISerializedLike, ISerializedListProduct, ISerializedListRecipe } from "@shared/model/interfaces"

type BasicStorageState<T> = {
    isLoading: boolean,
    error: number | undefined,
    data: T | undefined
}

type LikesState = BasicStorageState<Array<ISerializedLike>>

type FeaturedState = BasicStorageState<Array<ISerializedFeatured>>

type ProductsState = BasicStorageState<Array<ISerializedListProduct>>

type RecipesState = BasicStorageState<Array<ISerializedListRecipe>>

type BasketState = { [id: number]: number | undefined } // {[id: ProductId.id]: count}

export { LikesState, FeaturedState, ProductsState, RecipesState, BasketState }
