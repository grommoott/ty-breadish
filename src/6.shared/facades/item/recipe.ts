import { IListRecipe, IRecipe, ISerializedListRecipe } from "@shared/model/interfaces";
import { Item } from "./item";
import { AvgRate, ItemId, ItemInfo, RecipeId } from "@shared/model/types/primitives";
import { ExError } from "@shared/helpers";
import { createRecipe, createRecipeImage, deleteRecipe, deleteRecipeImage, getRecipe, getRecipesList, putRecipe, putRecipeImage } from "@shared/api/recipes";
import { backendBaseUrl } from "@shared/config";

class Recipe extends Item {

    // Private fields

    private _id: RecipeId
    private _recipe: string

    // Getters

    public get id(): RecipeId {
        return this._id
    }

    public get recipe(): string {
        return this._recipe
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/recipes/images/id/${this.id}`
    }

    // Methods

    public async edit(name?: string, description?: string, itemInfo?: ItemInfo, recipe?: string, image?: File): Promise<void | ExError> {
        const edit: void | ExError = await putRecipe(this.id, name, description, itemInfo, recipe)

        if (edit instanceof ExError) {
            return edit
        }

        if (image) {
            const putImage: void | ExError = await putRecipeImage(this.id, image)

            if (putImage instanceof ExError) {
                return putImage
            }
        }

        if (recipe) {
            this._recipe = recipe
        }

        super._edit(name, description, itemInfo)
    }

    public async delete(): Promise<void | ExError> {
        const del: void | ExError = await deleteRecipe(this.id)

        if (del instanceof ExError) {
            return del
        }

        const deleteImage: void | ExError = await deleteRecipeImage(this.id)

        if (deleteImage instanceof ExError) {
            return deleteImage
        }
    }

    // Static constructors

    public static async fromId(id: RecipeId): Promise<Recipe | ExError> {
        const recipe: IRecipe | ExError = await getRecipe(id)

        if (recipe instanceof ExError) {
            return recipe
        }

        return new Recipe(recipe)
    }

    public static async create(name: string, description: string, itemInfo: ItemInfo, recipe: string, image: File): Promise<Recipe | ExError> {
        const _recipe: IRecipe | ExError = await createRecipe(name, description, itemInfo, recipe)

        if (_recipe instanceof ExError) {
            return _recipe
        }

        const createImage: void | ExError = await createRecipeImage(_recipe.id, image)

        if (createImage instanceof ExError) {
            return createImage
        }

        return new Recipe(_recipe)
    }

    // Constructor

    private constructor({ id, recipe, itemId, name, description, avgRate, itemInfo }: IRecipe) {
        super({ itemId, name, description, avgRate, itemInfo })

        this._id = id
        this._recipe = recipe
    }
}

class ListRecipe {

    // Private fields

    private _listRecipe: IListRecipe

    // Getters

    public get id(): RecipeId {
        return this._listRecipe.id
    }

    public get itemId(): ItemId {
        return this._listRecipe.itemId
    }

    public get name(): string {
        return this._listRecipe.name
    }

    public get avgRate(): AvgRate {
        return this._listRecipe.avgRate
    }

    public get itemInfo(): ItemInfo {
        return this._listRecipe.itemInfo
    }

    public get imageLink(): string {
        return `${backendBaseUrl}/api/recipes/images/id/${this.id}`
    }

    // Methods

    public serialize(): ISerializedListRecipe {
        return {
            id: this.id.id,
            itemId: this.itemId.id,
            name: this.name,
            avgRate: this.avgRate.avgRate,
            itemInfo: this.itemInfo.toNormalView()
        }
    }

    // Static constructors

    public static async getRecipesList(): Promise<Array<ListRecipe> | ExError> {
        const recipes: Array<IListRecipe> | ExError = await getRecipesList()

        if (recipes instanceof ExError) {
            return recipes
        }

        return recipes.map(recipe => new ListRecipe(recipe))
    }

    public static parse(recipe: ISerializedListRecipe): ListRecipe | ExError {
        return new ListRecipe({
            id: new RecipeId(recipe.id),
            itemId: new ItemId(recipe.itemId),
            name: recipe.name,
            avgRate: new AvgRate(recipe.avgRate),
            itemInfo: ItemInfo.fromObject(recipe.itemInfo)
        })
    }

    // Constructor

    private constructor({ id, itemId, name, avgRate, itemInfo }: IListRecipe) {
        this._listRecipe = { id, itemId, name, avgRate, itemInfo }
    }

}

export { Recipe, ListRecipe }
