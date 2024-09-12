import { createFeatured, deleteFeatured, getFeatured } from "@shared/api/featured"
import { ExError } from "@shared/helpers"
import { IFeatured, ISerializedFeatured } from "@shared/model/interfaces"
import { ItemType } from "@shared/model/types/enums"
import { FeaturedId, ItemId, UserId } from "@shared/model/types/primitives"
import store from "@shared/store"
import { addFeatured, removeFeatured } from "@shared/store/actionCreators/featured"

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

        // Removing featured from global store 
        store.dispatch(removeFeatured(this.id))

        return await deleteFeatured(this.id)
    }

    public serialize(): ISerializedFeatured {
        return {
            id: this.id.id,
            from: this.from.id,
            target: this.target.id,
            itemType: this.itemType
        }
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
        const ifeatured: IFeatured | ExError = await createFeatured(target, itemType)

        if (ifeatured instanceof ExError) {
            return ifeatured
        }

        const featured: Featured = new Featured(ifeatured)

        // Adding featured to global store
        store.dispatch(addFeatured(featured.serialize()))

        return featured
    }

    public static parse(featured: ISerializedFeatured): Featured | ExError {
        if (!(
            "id" in featured &&
            "from" in featured &&
            "target" in featured &&
            "itemType" in featured
        )) {
            return new ExError("Invalid object to parse into featured", -400)
        }

        return new Featured({
            id: new FeaturedId(featured.id),
            from: new UserId(featured.from),
            target: new ItemId(featured.target),
            itemType: featured.itemType
        })
    }

    // Constructor

    private constructor({ id, from, target, itemType }: IFeatured) {
        this._featured = { id, from, target, itemType }
    }
}

export { Featured }
