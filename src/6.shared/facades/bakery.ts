import { createBakery, deleteBakery, getBakeries, getBakery, putBakery } from "@shared/api/bakeries";
import { ExError } from "@shared/helpers";
import { IBakery } from "@shared/model/interfaces";
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

    // Constructor

    private constructor({ id, address, coords }: IBakery) {
        this._bakery = { id, address, coords }
    }
}

export { Bakery }
