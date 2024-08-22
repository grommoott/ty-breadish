import { createFeatured, deleteFeatured, getFeatured } from "@shared/api/featured"
import { ExError } from "@shared/helpers"
import { IFeatured } from "@shared/model/interfaces"
import { ItemType } from "@shared/model/types/enums"
import { FeaturedId, ItemId, UserId } from "@shared/model/types/primitives"

class Featured {

    // Private fields

    private _featured: IFeatured

    // Getters

    public get id(): FeaturedId {
        return this._featured.id
    }

    public get from(): UserId {
        return this._featured.from
    }

    public get target(): ItemId {
        return this._featured.target
    }

    public get itemType(): ItemType {
        return this._featured.itemType
    }

    // Methods

    public async delete(): Promise<void | ExError> {
        return await deleteFeatured(this.id)
    }

    // Static constructors

    public static async getFeatured(): Promise<Array<Featured> | ExError> {
        const featured: Array<IFeatured> | ExError = await getFeatured()

        if (featured instanceof ExError) {
            return featured
        }

        return featured.map(aFeatured => new Featured(aFeatured))
    }

    public static async create(target: ItemId, itemType: ItemType): Promise<Featured | ExError> {
        const featured: IFeatured | ExError = await createFeatured(target, itemType)

        if (featured instanceof ExError) {
            return featured
        }

        return new Featured(featured)
    }

    // Constructor

    private constructor({ id, from, target, itemType }: IFeatured) {
        this._featured = { id, from, target, itemType }
    }
}

export { Featured }
