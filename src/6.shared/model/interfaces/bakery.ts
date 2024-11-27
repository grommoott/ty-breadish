import { BakeryId } from "../types/primitives"
import { Coords } from "../types/primitives/coords"

interface IBakery {
    id: BakeryId
    address: string
    coords: Coords
}

function responseDataToBakery(data: any): IBakery {
    if (!(
        "id" in data &&
        "address" in data &&
        "coords" in data)) {
        throw new Error("Invalid query row to convert into IBakery")
    }

    return {
        id: new BakeryId(data.id),
        address: data.address,
        coords: Coords.fromObject(data.coords)
    }
}

interface ISerializedBakery {
    id: number,
    address: string,
    coords: [number, number]
}

export { IBakery, responseDataToBakery, ISerializedBakery }
