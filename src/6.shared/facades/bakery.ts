import { createBakery, deleteBakery, getBakeries, getBakery, putBakery } from "@shared/api/bakeries";
import { ExError } from "@shared/helpers";
import { IBakery, ISerializedBakery } from "@shared/model/interfaces";
import { BakeryId, Coords } from "@shared/model/types/primitives";

class Bakery {

    // Private fields

    private _bakery: IBakery

    // Getters

    public get id(): BakeryId {
        return this._bakery.id
    }

    public get address(): string {
        return this._bakery.address
    }

    public get coords(): Coords {
        return this._bakery.coords
    }

    // Methods

    public async edit(address?: string, coords?: Coords): Promise<void | ExError> {
        return await putBakery(this.id, address, coords)
    }

    public async delete(): Promise<void | ExError> {
        return await deleteBakery(this.id)
    }

    public serialize(): ISerializedBakery {
        return {
            id: this.id.id,
            address: this.address,
            coords: [this.coords.latitude, this.coords.longitude]
        }
    }

    // Static constructors

    public static async fromId(id: BakeryId): Promise<Bakery | ExError> {
        const response = await getBakery(id)

        if (response instanceof ExError) {
            return response
        }

        return new Bakery(response)
    }

    public static async getList(): Promise<Array<Bakery> | ExError> {
        const response = await getBakeries()

        if (response instanceof ExError) {
            return response
        }

        return response.map(bakery => new Bakery(bakery))
    }

    public static async create(address: string, coords: Coords): Promise<Bakery | ExError> {
        const response = await createBakery(address, coords)

        if (response instanceof ExError) {
            return response
        }

        return new Bakery(response)
    }

    public static parse(bakery: ISerializedBakery): Bakery | ExError {
        if (!(
            "id" in bakery &&
            "address" in bakery &&
            "coords" in bakery
        )) {
            return new ExError("Invalid object to parse into bakery", -400)
        }

        return new Bakery({
            id: new BakeryId(bakery.id),
            address: bakery.address,
            coords: Coords.fromObject(bakery.coords)
        })
    }

    // Constructor

    private constructor({ id, address, coords }: IBakery) {
        this._bakery = { id, address, coords }
    }
}

export { Bakery }
